import express from "express";
import { testFiles } from "../controllers/chats.controller.js";

const chatRoute = express.Router();

// api/chats/test
chatRoute.post("/test", testFiles);


export default chatRoute;