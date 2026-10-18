import Work from "../models/work.model.js";
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
  const { information, message, workId } = req.body;
  const userId = req.user.id;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: "Authentication required"
    });
  }

  if (typeof message !== "string" || !message.trim()) {
    return res.status(400).json({
      success: false,
      message: "A message is required"
    });
  }

  try {
    const filesInfo = Array.isArray(information)
      ? information.filter(file => file && typeof file.info === "string")
      : typeof information === "string" && information.trim()
        ? FilesDataReader(information)
        : [];

    let WorkDoc;
    let namespaceWorkId;

    if (!workId) {
      WorkDoc = await Work.create({
        userId,
        title: filesInfo[0]?.filename || message.trim().slice(0, 60),
      });

      namespaceWorkId = WorkDoc._id.toString();
    } else {
      WorkDoc = await Work.findOne({ _id: workId, userId });
      if (!WorkDoc) {
        return res.status(404).json({
          success: false,
          message: "Conversation not found"
        });
      }

      namespaceWorkId = workId.toString();
    }

    // chunks + embedding
    for (let file of filesInfo) {
      if (!file.info || typeof file.info !== 'string') continue;

      // only content chunks
      const chunksText = await chunksOfInfomation(file.info);

      // vector record 
      for (let i = 0; i < chunksText.length; i++) {
        const singleChunk = chunksText[i];

        // single chunk embedding
        const Vector = await ContentEmbedding(singleChunk);

        let Id = `${file.filename}_chunk_${i}_${Date.now()}`;
        let metadata = {
          Text: singleChunk,                  // exact text
          fileName: file.filename,
          fileExtension: file.filetype,
          fileLocation: file.FileLocation
        };

        await InsertFilesData(namespaceWorkId, Id, Vector, metadata);
      }
    }


    // vector question
    const VectorQuestion = await ContentEmbedding(message.trim());
    const PineconeTopKData = (workId || filesInfo.length > 0)
      ? await SearchFilesData(namespaceWorkId, VectorQuestion)
      : { matches: [] };

    //  Extract actual text
    const contextText = Array.isArray(PineconeTopKData?.matches)
      ? PineconeTopKData.matches
        .map(match => `[File: ${match.metadata?.fileName}]\n${match.metadata?.Text}`)
        .join("\n\n---\n\n")
      : "";
    const relatedFiles = [...new Set(
      (PineconeTopKData?.matches || [])
        .map(match => match.metadata?.fileName)
        .filter(fileName => typeof fileName === "string" && fileName.length > 0)
    )];


    // History
    const recentHistory = (WorkDoc.messages || [])
      .slice(-6)
      .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
      .join("\n");



    const prompt = `
Context from files:
${contextText}

When context from files is available, answer using that context and name the relevant files in your answer. If no relevant file context is available, say so instead of inventing file-based facts.

Conversation History:
${recentHistory}

User Question: ${message.trim()}

Provide a helpful, precise answer based strictly on the provided context.
    `;


    // LLM
    const response = await GroqResponse(prompt);


    // message and AI response for both paths
    await Work.findByIdAndUpdate(
      namespaceWorkId,
      {
        $push: {
          messages: {
            $each: [
              {
                role: "user",
                content: message.trim(),
                ProjectStructure: JSON.stringify(filesInfo),
              },
              {
                role: "assistant",
                content: response,
                sources: relatedFiles,
              },
            ],
          },
        },
      },
      { returnDocument: "after" }
    );

    return res.json({
      data: filesInfo,
      response: response,
      sources: relatedFiles,
      workId: namespaceWorkId
    });

  } catch (err) {
    console.log("Error : ", err);
    return res.status(500).json({
      error: err.message
    });
  }
};


const receiveFiles = async (req, res) => {

  try {

    const { workId } = req.params

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authorized"
      });
    }

    const WorksChat = await Work.findOne({ _id: workId, userId });

    if (!WorksChat) {
      return res.status(404).json({
        success: false,
        message: "Conversation not found",
      });
    }

    return res.json({
      success: true,
      message : WorksChat
    });


  } catch (err) {
    console.error("ReceiveFilesAll Error:", err);
    return res.status(500).json({
      error: err.message
    });

  }
}


const receiveFilesAll = async (req, res) => {

  try {

    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authorized"
      });
    }

    const allWorksChat = await Work
      .find({ userId })
      .sort({ updatedAt: -1 })
      .limit(10);

    return res.json({
      success: true,
      allWorksChat
    });

  } catch (err) {
    console.error("ReceiveFilesAll Error:", err);
    return res.status(500).json({
      error: err.message
    });

  }
}


export { testFiles, uploadFiles, receiveFiles, receiveFilesAll };