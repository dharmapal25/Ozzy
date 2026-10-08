import { pinecone } from "../config/pinecone.config.js";


let pcIndex = pinecone.Index("ezzy") // same as index name in pinecone


const namespace = pcIndex.namespace("WORK_CHAT_MONGO_ID");

const InsertFilesData = async (fileId, Vector,metadata) => {

let pineconeData = await namespace.upsert({
  records: [
    {
      id: fileId,
      values: Vector,
      metadata: metadata || {}
    }
  ]
});

    console.log("Inserted data into Pinecone:", pineconeData);

}

export {InsertFilesData}