import {gemini} from "../config/gemini.config.js"

const ContentEmbedding = async () => {
        let EmbeddingValue = await gemini.models.embedContent({
            model: 'gemini-embedding-2',
            contents: [
                'explain react',
            ],
            config: {
                outputDimensionality: 4 // 4 Dimensions in the output vector
            }
        })

        return EmbeddingValue
}


export default ContentEmbedding