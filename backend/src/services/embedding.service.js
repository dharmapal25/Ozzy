import { gemini } from "../config/gemini.config.js";

const ContentEmbedding = async (text) => {
    try {
        // Check valid text
        // if (!text || typeof text !== "string") {
        //     throw new Error("Embedding for required string text");
        // }


        const response = await gemini.models.embedContent({
            model: "gemini-embedding-2",
            contents: [text],
            // contents: ['explain react'],
            config: { 
                outputDimensionality: 1024 
            } //  dimension witout pass default 768 
        });

        // Pinecone values of array  [0.012, -0.045, ...]
        const vectorValues = response.embeddings[0].values;

        // console.log("first >> ", response?.embeddings[0].values)

        return vectorValues;


    } catch (error) {
        console.error("Gemini Embedding Error:", error.message);
        throw error;
    }
};

export default ContentEmbedding;