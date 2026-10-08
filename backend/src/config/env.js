import dotenv from "dotenv"
dotenv.config();

const env = {
    PORT : process.env.PORT,
    GOOGLE_API_KEY : process.env.GOOGLE_API_KEY,
    GEMINI_MODEL : process.env.GEMINI_MODEL,
    PINECONE_API_KEY : process.env.PINECONE_API_KEY
}


export default env;