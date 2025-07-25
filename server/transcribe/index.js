const { AssemblyAI } = require("assemblyai");
const fs = require("fs");
const axios = require("axios");

class Transcriber {
  constructor(apiKey) {
    console.log(apiKey);
    this.apiKey = apiKey;
    this.client = new AssemblyAI({ apiKey });
  }

  async uploadFile(filePath) {
    try {
      const file = fs.createReadStream(filePath);

      const response = await axios.post(
        "https://api.assemblyai.com/v2/upload",
        file,
        {
          headers: {
            authorization: this.apiKey,
            "transfer-encoding": "chunked",
          },
        }
      );

      return response.data.upload_url; // Use this for transcription
    } catch (err) {
      console.error("Error uploading file:", err);
      throw err;
    }
  }

  async transcribeAudio(uploadUrl) {
    console.log(this.apiKey);
    try {
      const response = await axios.post(
        "https://api.assemblyai.com/v2/transcript",
        {
          audio_url: uploadUrl,
          speaker_labels: true,
          // auto_chapters: true,
          entity_detection: true,
          iab_categories: true,
          summarization: true,
          summary_model: "informative",
          summary_type: "bullets",
        },
        {
          headers: {
            authorization: this.apiKey,
            "content-type": "application/json",
          },
        }
      );

      return response.data.id; // transcript ID to poll later
    } catch (err) {
      console.error("Error transcribing audio:", err);
      throw err;
    }
  }

  async pollTranscript(transcriptId) {
    const url = `https://api.assemblyai.com/v2/transcript/${transcriptId}`;
    let completed = false;

    while (!completed) {
      const response = await axios.get(url, {
        headers: { authorization: this.apiKey },
      });

      if (response.data.status === "completed") {
        console.log('completed transcript')
        completed = true;
        return response.data;
      } else if (response.data.status === "error") {
        throw new Error(response.data.error);
      }

      await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait before retrying
    }
  }

  async transcribeLocalFile(filePath) {
    const uploadUrl = await this.uploadFile(filePath);
    // console.log(uploadUrl)
    // // const uploadUrl = "https://cdn.assemblyai.com/upload/3b696402-a0e4-4dba-b2fe-decf44064b43"
    const transcriptId = await this.transcribeAudio(uploadUrl);
    // console.log("Transcription ID:", transcriptId);
    // const transcriptId = "078f2bc6-0d70-4e79-99c0-dc71c7f57aa8";
    const transcriptText = await this.pollTranscript(transcriptId);
    // console.log('transcript text',transcriptText)
    return transcriptText;
  }
}

const transcriber = new Transcriber(process.env.ASSEMBLYAI_API_KEY);
module.exports = transcriber;
