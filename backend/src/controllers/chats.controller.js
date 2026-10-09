import ContentEmbedding from "../services/embedding.service.js";
import FilesDataReader from "../services/file.service.js";
import GroqResponse from "../services/groq.service.js";
import { InsertFilesData, SearchFilesData } from "../services/pinecone.service.js";
import chunksOfInfomation from "../utils/chucks.js";

const testFiles = async (req, res) => {
  const { information } = req.body;

  try {
    let filesInfo = FilesDataReader(information);

    let DemoPincone = [];


    for (let file of filesInfo) {


      if (!file.info || typeof file.info !== 'string') continue;

      // only content chunks
      const chunksText = await chunksOfInfomation(file.info);
      // console.log(`File: ${file.filename} -> Total Chunks: ${chunksText.length}`);

      // vector record 
      for (let i = 0; i < chunksText.length; i++) {
        const singleChunk = chunksText[i];


        // single chunk embedding
        const Vector = await ContentEmbedding(singleChunk);
        console.log(Vector.length, "Vector length : ", Vector);
        // DemoPincone.push({
        //   id: `${file.filename}_chunk_${i}_${Date.now()}`,
        //   values: Vector, 
        //   metadata: {
        //     Text: singleChunk,                  // exact text
        //     fileName: file.filename,
        //     fileExtension: file.filetype,
        //     fileLocation: file.FileLocation
        // }
        // });

        let Id = `${file.filename}_chunk_${i}_${Date.now()}`
        let metadata = {
          Text: singleChunk,                  // exact text
          fileName: file.filename,
          fileExtension: file.filetype,
          fileLocation: file.FileLocation
        }

        console.log("metadata :------------------------------------------ ", Vector)


        await InsertFilesData(Id, Vector, metadata)

      }
    }


    return res.json({
      totalVectors: DemoPincone.length,
      data: filesInfo,
      DemoPincone
    });

  } catch (err) {
    console.log("Error : ", err);
    return res.status(500).json({
      error: err.message
    });
  }
};


const uploadFiles = async (req, res) => {
  const { information } = req.body;

  try {
    let filesInfo = FilesDataReader(information);


    for (let file of filesInfo) {


      if (!file.info || typeof file.info !== 'string') continue;

      // only content chunks
      const chunksText = await chunksOfInfomation(file.info);

      // vector record 
      for (let i = 0; i < chunksText.length; i++) {
        const singleChunk = chunksText[i];

        // single chunk embedding
        const Vector = await ContentEmbedding(singleChunk);

        let Id = `${file.filename}_chunk_${i}_${Date.now()}`
        let metadata = {
          Text: singleChunk,                  // exact text
          fileName: file.filename,
          fileExtension: file.filetype,
          fileLocation: file.FileLocation
        }

        await InsertFilesData(Id, Vector, metadata)

      }
    }

    return res.json({
      data: filesInfo
    });

  } catch (err) {
    console.log("Error : ", err);
    return res.status(500).json({
      error: err.message
    });
  }
}



const receiveFiles = async (req, res) => {
  const { message } = req.body;

  try {

    const FoundData = await SearchFilesData(message);

    const context = `
    similer VECTOR DATA : ${FoundData}
    USER QUESTION : ${message}
    `

    const AiResponse = await GroqResponse(context);

      

    return res.json({
      data: AiResponse
    });

  } catch (err) {
    console.log("Error : ", err);
    return res.status(500).json({
      error: err.message
    });
  }
}


export { testFiles, uploadFiles, receiveFiles };