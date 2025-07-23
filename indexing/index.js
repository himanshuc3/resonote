const algoliasearch = require("algoliasearch");

export class AlgoliaIndex {
  constructor(appId, apiKey, indexName) {
    this.algolia = algoliasearch(appId, apiKey);
    this.index = this.algolia.initIndex(indexName);
  }

  async indexTranscription(transcription, metadata = {}) {
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

    await this.index.saveObject(object);
  }
}

const algoliaIndexing = new AlgoliaIndex(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_ADMIN_KEY,
  process.env.ALGOLIA_INDEX
);

module.exports = algoliaIndexing;
