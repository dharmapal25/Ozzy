import dotenv from "dotenv"
dotenv.config();

const env = {
    PORT : process.env.PORT,
    FRONTEND_URL : process.env.FRONTEND_URL,
    
    GOOGLE_API_KEY : process.env.GOOGLE_API_KEY,
    GEMINI_MODEL : process.env.GEMINI_MODEL,
    MONGO_URI : process.env.MONGO_URI,
    PINECONE_API_KEY : process.env.PINECONE_API_KEY
}


export default env;