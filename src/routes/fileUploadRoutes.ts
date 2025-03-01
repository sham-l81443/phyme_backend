import express from "express";
import { streamVideo, upload } from "@/controllers/uplaod-file-controller/uploadVideo";
import { uploadVideo } from "@/controllers/uplaod-file-controller/uploadVideo";

const router = express.Router();

// Route to handle file upload
router.post("/upload", upload.single("video"), uploadVideo);
router.get("/stream/:filename", streamVideo);

export default router;
