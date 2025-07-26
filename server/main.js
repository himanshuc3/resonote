import "dotenv/config";
import express from "express";
import axios from "axios";
import ytdl from "ytdl-core";
import fs from "fs";
import { exec } from "child_process";
import path from "path";
import cors from "cors";
import {fileURLToPath} from "url";
import algoliaindexing from "./indexing/index.js";
import transcriber from "./transcribe/index.js";
import { startup, getSession } from "./mcpSession/index.js";

startup()
const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());


const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY;
const ALGOLIA_INDEX = process.env.ALGOLIA_INDEX;
  
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OUTPUT_DIR = path.resolve(__dirname, "downloads");
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

async function downloadYoutubeAudio(ytURL) {
  return new Promise((res, rej) => {
    ytdl.getInfo(ytURL)
      .then((info) => {
        // Sanitize filename
        let safeTitle = info.videoDetails.title.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_");
        // Pick format with both video and audio, prefer mp4
        let format = info.formats.find(f => f.container === 'mp4' && f.hasAudio && f.hasVideo);
        if (!format) {
          // fallback: any format with both video and audio
          format = info.formats.find(f => f.hasAudio && f.hasVideo);
        }
        if (!format) {
          // fallback: any format with audio
          format = info.formats.find(f => f.hasAudio);
        }
        if (!format) {
          // fallback: any format
          format = info.formats[0];
        }
        console.log('Chosen format:', format);
        const outputFilePath = path.join(OUTPUT_DIR, `${safeTitle}.${format.container}`);
        const outputStream = fs.createWriteStream(outputFilePath);
        // Download the chosen format
        ytdl(ytURL, { format: format }).pipe(outputStream);
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

app.post('/api/search', async (req, res) => {
  try{

    const { query } = req.body;
    console.log("Search query:", query, ALGOLIA_INDEX);
    const response = await getSession().callTool('searchSingleIndex', {
      index: ALGOLIA_INDEX, query, filters: ''
    });
    res.json(response.result || response.content);
  }catch(err){
    console.error("Error in search endpoint:", err);
    res.status(500).json({ error: "Failed to perform search", details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Local server running on http://localhost:${PORT}`);
});
