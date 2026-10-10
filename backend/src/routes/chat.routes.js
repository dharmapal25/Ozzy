import express from "express";
import { receiveFiles, receiveFilesAll, testFiles, uploadFiles } from "../controllers/chats.controller.js";

const chatRoute = express.Router();

// api/work/test
chatRoute.post("/test", testFiles);


// api/work/upload-files
chatRoute.post("/upload-files", uploadFiles);


// api/work/receive-all-files
chatRoute.post("/receive-all-files", receiveFiles);


// api/work/receive-all-files/:workId
chatRoute.post("/receive-file/:workId", receiveFilesAll);



export default chatRoute;