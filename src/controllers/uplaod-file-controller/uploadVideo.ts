import express from "express";
import { NextFunction, Response, Request } from "express";
import multer from "multer";
import fs from 'fs';
import path from 'path';

// Define uploads directory path once
const projectRoot = path.resolve(__dirname, '../../..');
const uploadsDir = path.join(projectRoot, 'uploads');

// Create the uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log(`Created uploads directory at: ${uploadsDir}`);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ["video/mp4", "video/mkv", "video/avi"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Invalid file type"));
    }
};

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 300 * 1024 * 1024 }, // 300MB limit
});

export const uploadVideo = async (req: Request, res: Response) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        return res.json({ message: "File uploaded successfully", filename: file.filename });
    } catch (error) {
        console.error('Upload error:', error);
        return res.status(500).json({ error: "Upload failed" });
    }
};

export const streamVideo = async (req: Request, res: Response) => {
    console.log("Streaming endpoint hit!", {
        filename: req.params.filename,
        headers: req.headers,
        url: req.url
    });
    try {
        const filename = req.params.filename;
        if (!filename) {
            return res.status(400).json({ error: "Filename is required" });
        }

        const videoPath = path.join(uploadsDir, filename);

        console.log(videoPath)

        // Check if file exists
        if (!fs.existsSync(videoPath)) {
            return res.status(404).json({ error: "Video not found" });
        }

        const stat = fs.statSync(videoPath);
        const fileSize = stat.size;
        const range = req.headers.range;

        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

            if (isNaN(start) || isNaN(end) || start >= fileSize || end >= fileSize) {
                res.status(416).send('Requested range not satisfiable');
                return;
            }

            const chunkSize = (end - start) + 1;
            const file = fs.createReadStream(videoPath, { start, end });

            const head = {
                'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunkSize,
                'Content-Type': 'video/mp4',
            };

            res.writeHead(206, head);
            file.pipe(res);
        } else {
            const head = {
                'Content-Length': fileSize,
                'Content-Type': 'video/mp4',
            };
            res.writeHead(200, head);
            fs.createReadStream(videoPath).pipe(res);
        }
    } catch (error) {
        console.error('Streaming error:', error);
        res.status(500).json({ error: "Streaming failed" });
    }
};

// Router setup
const router = express.Router();


export default router;