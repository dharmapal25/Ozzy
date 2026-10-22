import express from "express";
import multer from "multer";
import { receiveFiles, receiveFilesAll, uploadFiles } from "../controllers/chats.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";

const chatRoute = express.Router();

// Memory Storage: Files direct to the RAM buffer (without any temp folder)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Chat & File Upload Route 
chatRoute.post("/upload-files", verifyToken, upload.any(), uploadFiles);


// Sidebar workspaces list
chatRoute.get("/receive-all-files", verifyToken, receiveFilesAll);


// chat history load 
chatRoute.get("/receive-file/:workId", verifyToken, receiveFiles);

export default chatRoute;