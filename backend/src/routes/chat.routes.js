import express from "express";
import { receiveFiles, receiveFilesAll, testFiles, uploadFiles } from "../controllers/chats.controller.js";
import { authenticateUser } from "../middlewares/auth.middleware.js";

const chatRoute = express.Router();

// api/work/test
chatRoute.post("/test", testFiles);

// api/work/upload-files
chatRoute.post("/upload-files", authenticateUser, uploadFiles);

// api/work/receive-all-files
chatRoute.get("/receive-all-files", authenticateUser, receiveFilesAll);

// api/work/receive-file/:workId
chatRoute.get("/receive-file/:workId", authenticateUser, receiveFiles);



export default chatRoute;