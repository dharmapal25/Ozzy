import express from "express";
import chatRoute from "./routes/chat.routes.js";
import cors from "cors";
import env from "./config/env.js";
import connectMongoDB from "./config/mongo.config.js";
import cookieParser from "cookie-parser";
import router from "./routes/auth.routes.js";

const app = express();


app.use(express.json());

app.use(cookieParser());

app.use(cors({
    origin: env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);


connectMongoDB();


// Works
app.use("/api/work", chatRoute);


// Register authentication routes
app.use("/api/auth", router);



export default app