import express from "express";
import chatRoute from "./routes/chat.routes.js";

const app = express();

app.use(express.json());

app.use("/api/chat", chatRoute);

export default app