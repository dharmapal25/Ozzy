import express from "express";
import chatRoute from "./routes/chat.routes.js";
import cors from "cors";
import env from "./config/env.js";
import connectMongoDB from "./config/mongo.config.js";


const app = express();

app.use(express.json());
app.use(cors({
    origin: env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


connectMongoDB();


app.use("/api/chat", chatRoute);

export default app