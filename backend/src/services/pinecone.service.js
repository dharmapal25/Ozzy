import { pinecone } from "../config/pinecone.config.js";


let pcIndex = pinecone.Index("ezzy") // same as index name in pinecone

// function pineconeNamespace(name) {
//    return pcIndex.namespace("WORK_CHAT_MONGO_ID");
// }

const InsertFilesData = async (namespaceId, fileId, Vector, metadata) => {

  let pineconeData = await pcIndex.namespace(namespaceId).upsert({
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


const SearchFilesData = async (namespaceId, vectorQuery) => {
  const namespace = pcIndex.namespace(namespaceId);

  let results = await namespace.query({
    vector: vectorQuery,
    topK: 5,
    includeMetadata: true
  });


  console.log("Search data into Pinecone:", results);

  return results

}



export { InsertFilesData, SearchFilesData }