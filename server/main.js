require("dotenv").config();
const express = require("express");
const axios = require("axios");
const ytdl = require("ytdl-core");
const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");
const cors = require("cors");
const algoliaindexing = require("./indexing");
const transcriber =  require("./transcribe");

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());

const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY;
const ALGOLIA_INDEX = process.env.ALGOLIA_INDEX;

const OUTPUT_DIR = path.resolve(__dirname, "downloads");
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

async function downloadYoutubeAudio(ytURL) {
  return new Promise((res, rej) => {
    ytdl.getInfo(ytURL)
      .then((info) => {
        // Sanitize filename
        let safeTitle = info.videoDetails.title.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_");
        // Pick audio-only format (itag 140 = m4a, or fallback to audioonly filter)
        let format = ytdl.chooseFormat(info.formats, { quality: "140" });
        if (!format || !format.container) {
          // fallback: use audioonly filter
          format = { container: 'mp3' };
        }
        const outputFilePath = path.join(OUTPUT_DIR, `${safeTitle}.${format.container}`);
        const outputStream = fs.createWriteStream(outputFilePath);
        // Download audio only
        ytdl(ytURL, { filter: 'audioonly' }).pipe(outputStream);
        outputStream.on("finish", () => {
          console.log(`Finished downloading: ${outputFilePath}`);
          res(outputFilePath);
        });
        outputStream.on("error", (err) => {
          console.error("Stream error:", err);
          rej(err);
        });
      })
      .catch((err) => {
        console.error(err);
        rej(err);
      });
  });
}




app.post("/transcribe", async (req,  res) => {
  // const { youtubeUrl, title } = req.body;
  const filePath = path.join(OUTPUT_DIR, "hello_world.mp4");
  try {
    const transcript = await transcriber.transcribeLocalFile(filePath);
    console.log(transcript.id, transcript.audio_url)
    await algoliaindexing.indexVideoChunks(transcript.audio_url,transcript);
    // fs.unlinkSync(filePath);
    // res.json({ success: true, transcriptId: transcript });
    res.send("Transcription started. Check console for output.");
  } catch (error) {
    console.error("Error during transcription:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/", (_, res) => {
  res.send("Health Check... Resonote is running!");
});

app.post("/download_video", async (req, res) => {
  const { youtubeUrl, title } = req.body;

  try {
    const filePath = await downloadYoutubeAudio(youtubeUrl, title);
    console.log(`Video downloaded to: ${filePath}`);
    res.json({
      message:
        "Download video endpoint is not implemented yet. Please use /transcribe endpoint to transcribe YouTube videos.",
    });
  } catch (err) {
    res.status(500).json({
      error: "Failed to download video",
      details: err.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Local server running on http://localhost:${PORT}`);
});
