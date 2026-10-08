import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';

const chunksOfInfomation = async (text) => {

    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });

    // const chunkedDocs = await textSplitter.createDocuments([text]);
    const chunkedDocs = await textSplitter.splitText(text);

    return chunkedDocs;

}

export default chunksOfInfomation