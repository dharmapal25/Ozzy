import dotenv from "dotenv"
dotenv.config();

const env = {
    PORT : process.env.PORT,
    FRONTEND_URL : process.env.FRONTEND_URL,
    
    GOOGLE_API_KEY : process.env.GOOGLE_API_KEY,
    GEMINI_MODEL : process.env.GEMINI_MODEL,
    MONGO_URI : process.env.MONGO_URI,
    PINECONE_API_KEY : process.env.PINECONE_API_KEY,

    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,

    JWT_SECRET: process.env.JWT_SECRET,

    GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,

    NODE_ENV: process.env.NODE_ENV || "development",
}


export default env;