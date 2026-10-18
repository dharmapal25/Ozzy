import express from "express";
import { receiveFiles, receiveFilesAll, testFiles, uploadFiles } from "../controllers/chats.controller.js";
import verifyToken from "../middlewares/auth.middleware.js";


const chatRoute = express.Router();

// api/work/test
chatRoute.post("/test", testFiles);

// api/work/upload-files
chatRoute.post("/upload-files", verifyToken, uploadFiles);

// api/work/receive-all-files
chatRoute.get("/receive-all-files", verifyToken, receiveFilesAll);

// api/work/receive-file/:workId
chatRoute.get("/receive-file/:workId", verifyToken, receiveFiles);



export default chatRoute;