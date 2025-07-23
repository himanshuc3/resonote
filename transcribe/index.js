const {AssemblyAI} = require('assemblyai');

class Transcriber {
    constructor(apiKey){
        this.client = new AssemblyAI(apiKey)
    }


}

const transcriber = new Transcriber(process.env.ASSEMBLYAI_API_KEY);
module.exports = transcriber;