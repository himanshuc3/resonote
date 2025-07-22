const express = require("express");
const axios = require("axios");
const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());

const ASSEMBLY_API_KEY = process.env.ASSEMBLY_API_KEY;
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
const ALGOLIA_ADMIN_KEY = process.env.ALGOLIA_ADMIN_KEY;
const ALGOLIA_INDEX = process.env.ALGOLIA_INDEX;

const OUTPUT_DIR = path.resolve(__dirname, "downloads");
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

async function downloadYoutubeAudio(ytURL, outputName) {
  return new Promise((res, rej) => {
    const filePath = path.join(OUTPUT_DIR, `${outputName}.mp3`);
    const cmd = `yt-dlp -x --audio-format mp3 -o "${filePath}" ${ytURL}`;
    exec(cmd, (err) => {
      if (err) return rej(err);
      res(filePath);
    });
  });
}

async function uploadAudioToAssemblyAI(filePath) {
    const data = fs.createReadStream(filePath);
    const res = await axios.post(
        "https://api.assemblyai.com/v2/upload",
        data,
        {
            headers: {
                authorization: ASSEMBLY_API_KEY,
                "Transfer-Encoding": "chunked",
            },
        }
    );
    return res.data.upload_url;
}

async function transcribeAudio(audioUrl) {
  const res = await axios.post(
    "https://api.assemblyai.com/v2/transcript",
    {
      audio_url: audioUrl,
      speaker_labels: true,
      auto_chapters: true,
      entity_detection: true,
      iab_categories: true,
    },
    {
      headers: {
        authorization: ASSEMBLY_API_KEY,
      },
    }
  );
  return res.data.id;
}

async function waitForTranscript(transcriptId) {
  while (true) {
    const res = await axios.get(
      `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
      {
        headers: {
          authorization: ASSEMBLY_API_KEY,
        },
      }
    );
    if (res.data.status === "completed") return res.data;
    if (res.data.status === "error") throw new Error(res.data.error);
    // NOTE:
    // 1. Promisifying timeout is equivalent to sleep
    await new Promise((r) => setTimeout(r, 5000));
  }
}

async function indexToAlgolia(transcription, metadata = {}) {
  const algolia = require("algoliasearch")(ALGOLIA_APP_ID, ALGOLIA_ADMIN_KEY);
  const index = algolia.initIndex(ALGOLIA_INDEX);

  const object = {
    objectID: transcription.id,
    text: transcription.text,
    _mcp: {
      content: transcription.text,
      title: metadata.title || "YouTube Transcript",
      id: transcription.id,
      description: `Transcript with chapters and speaker labels from YouTube.`,
      tags: transcription.entities?.map((e) => e.entity_type) || [],
      metadata: {
        chapters: transcription.chapters?.length || 0,
        duration: transcription.audio_duration || 0,
        speakers: [
          ...new Set(
            transcription.words?.map((w) => w.speaker).filter(Boolean)
          ),
        ],
      },
    },
  };

  await index.saveObject(object);
}


app.post("/transcribe", async (req, res) => {
    const {youtubeUrl, title} = req.body

    try {

        const filePath = await downloadYoutubeAudio(youtubeUrl, title);
        const audioUrl = await uploadAudioToAssemblyAI(filePath)
        const transcriptId = await transcribeAudio(audioUrl)
        const transcript = await waitForTranscript(transcriptId)
        await indexToAlgolia(transcript, {title})
        fs.unlinkSync(filePath)
        res.json({success: true, transcriptId: transcript})
    } catch (error) {
        console.error("Error during transcription:", error);
        res.status(500).json({success: false, error: error.message});
    }
})

app.get("/", (_, res) => res.send("Youtube Audio Search Backend is running!"))


app.listen(PORT, () => {
    console.log(`Local server running on http://localhost:${PORT}`)
})