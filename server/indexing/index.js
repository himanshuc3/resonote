import { algoliasearch } from "algoliasearch";

const MIN_CHUNK_LENGTH = 50; // 5 seconds

class AlgoliaIndex {
  constructor(appId, apiKey, indexName) {
    // Debug: print env vars
    console.log(appId)
    if (!appId || !apiKey || !indexName) {
      console.error("Algolia env vars missing:", { appId, apiKey, indexName });
    }
    console.log(appId, apiKey);
    this.algolia = algoliasearch(appId, apiKey);
    this.index = indexName;
  }

  async indexVideoChunks(videoID, transcript) {
    try {
      const records = transcript.utterances
        .filter((u) => u.text.length >= MIN_CHUNK_LENGTH)
        .map((u) => {
          const start = u.start;
          const end = u.end;
          const text = u.text.trim();
          const summary = transcript.summary;
          return {
            objectID: `${videoID}-${start}`,
            videoID,
            start,
            end,
            text,
            summary: summary,
          };
        });
      const res = await this.algolia.saveObjects({
        indexName: this.index,
        objects: records,
      });
      console.log("Indexed:", res);
    } catch (error) {
      console.error("Error indexing video chunks:", error);
    }
  }
}
console.log(process.env)
const algoliaIndexing = new AlgoliaIndex(
  process.env.ALGOLIA_APP_ID,
  process.env.ALGOLIA_WRITE_API_KEY,
  process.env.ALGOLIA_INDEX
);

export default algoliaIndexing;
