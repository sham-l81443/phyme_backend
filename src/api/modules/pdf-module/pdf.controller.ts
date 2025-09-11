import { Request, Response, NextFunction } from "express";
import { PdfService } from "./pdf.service";
import createSuccessResponse from "../../../core/utils/responseCreator";
import { AppError } from "../../../core/utils/errors/AppError";
import path from 'path';
import fs from 'fs';

export class PdfController {
  static async uploadPdf(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('Upload request body:', req.body);
      console.log('Upload request file:', req.file);

      if (!req.file) {
        throw new AppError({
          errorType: "Bad Request",
          message: "No PDF file uploaded"
        });
      }

      const { lessonId, name } = req.body;

      if (!lessonId || !name) {
        throw new AppError({
          errorType: "Bad Request",
          message: "Lesson ID and name are required"
        });
      }

      const pdfData = {
        name: name.trim(),
        originalName: req.file.originalname,
        fileName: req.file.filename,
        filePath: req.file.path,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        lessonId: lessonId,
      };

      console.log('PDF data to save:', pdfData);

      const pdf = await PdfService.uploadPdf(pdfData);

      res.status(201).json(
        createSuccessResponse({
          data: pdf,
          message: "PDF uploaded successfully",
        })
      );
    } catch (error) {
      console.error('PDF upload error:', error);
      next(error);
    }
  }

  static async getPdfsByLessonId(req: Request, res: Response, next: NextFunction) {
    try {
      const { lessonId } = req.params;

      if (!lessonId) {
        throw new AppError({
          errorType: "Bad Request",
          message: "Lesson ID is required"
        });
      }

      const pdfs = await PdfService.getPdfsByLessonId(lessonId);

      res.status(200).json(
        createSuccessResponse({
          data: pdfs,
          message: "PDFs fetched successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  }

  static async downloadPdf(req: Request, res: Response, next: NextFunction) {
    try {
      console.log('PDF download request for ID:', req.params.pdfId);
      
      const { pdfId } = req.params;

      if (!pdfId) {
        throw new AppError({
          errorType: "Bad Request",
          message: "PDF ID is required"
        });
      }

      const pdf = await PdfService.getPdfById(pdfId);
      console.log('PDF found:', pdf);
      
      // The filePath stored in database is already the full path
      const filePath = pdf.filePath;

      console.log('PDF file path:', filePath);
      console.log('File exists:', fs.existsSync(filePath));

      if (!fs.existsSync(filePath)) {
        console.error('PDF file not found at path:', filePath);
        throw new AppError({
          errorType: "Not Found",
          message: "PDF file not found on server"
        });
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${pdf.originalName}"`);
      res.setHeader('Content-Length', pdf.fileSize);

      const fileStream = fs.createReadStream(filePath);
      
      fileStream.on('error', (error) => {
        console.error('File stream error:', error);
        next(error);
      });
      
      fileStream.pipe(res);
    } catch (error) {
      console.error('PDF download error:', error);
      next(error);
    }
  }

  static async deletePdf(req: Request, res: Response, next: NextFunction) {
    try {
      const { pdfId } = req.params;

      if (!pdfId) {
        throw new AppError({
          errorType: "Bad Request",
          message: "PDF ID is required"
        });
      }

      await PdfService.deletePdf(pdfId);

      res.status(200).json(
        createSuccessResponse({
          data: null,
          message: "PDF deleted successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  }

  static async getAllPdfs(req: Request, res: Response, next: NextFunction) {
    try {
      const pdfs = await PdfService.getAllPdfs();

      res.status(200).json(
        createSuccessResponse({
          data: pdfs,
          message: "PDFs fetched successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  }
}
