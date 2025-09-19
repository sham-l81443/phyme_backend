import express from "express";
import { PdfController } from "./pdf.controller";
import { authenticateAdmin } from "../../../core/middleware/auth/authenticateAdmin";
import { authenticateStudent } from "../../../core/middleware/auth/authenticateStudent";
import { uploadSinglePdf } from "../../../core/middleware/upload";

const pdfRouter = express.Router();

// Admin routes
pdfRouter.post("/admin/pdf/upload", authenticateAdmin, uploadSinglePdf, PdfController.uploadPdf);
pdfRouter.delete("/admin/pdf/deleteById/:pdfId", authenticateAdmin, PdfController.deletePdf);
pdfRouter.get("/admin/pdfs", authenticateAdmin, PdfController.getAllPdfs);
pdfRouter.get("/admin/pdf/:pdfId/download", authenticateAdmin, PdfController.downloadPdf);

// Student routes
pdfRouter.get("/student/lesson/:lessonId/pdfs", authenticateStudent, PdfController.getPdfsByLessonId);
pdfRouter.get("/student/pdf/:pdfId/download", authenticateStudent, PdfController.downloadPdf);

export default pdfRouter;
