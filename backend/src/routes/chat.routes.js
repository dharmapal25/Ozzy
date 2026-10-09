import express from "express";
import { receiveFilesAll, testFiles, uploadFiles } from "../controllers/chats.controller.js";

const chatRoute = express.Router();

// api/chats/test
chatRoute.post("/test", testFiles);


// api/chats/upload-files
chatRoute.post("/upload-files", uploadFiles);


// api/chats/search-files
chatRoute.post("/search-files", receiveFilesAll);


export default chatRoute;