import ContentEmbedding from "../services/embedding.service.js";
import FilesDataReader from "../services/file.service.js";
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
      console.log(`File: ${file.filename} -> Total Chunks: ${chunksText.length}`);

      // vector record 
      for (let i = 0; i < chunksText.length; i++) {
        const singleChunk = chunksText[i];


        // single chunk embedding
        const Vector = await ContentEmbedding(singleChunk);
        console.log(Vector)
        DemoPincone.push({
          id: `${file.filename}_chunk_${i}_${Date.now()}`,
          values: Vector, 
          metadata: {
            Text: singleChunk,                  // exact text
            fileName: file.filename,
            fileExtension: file.filetype,
            fileLocation: file.FileLocation
          }
        });
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

export { testFiles };