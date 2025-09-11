import { PdfRepository } from "./pdf.repository";
import { rethrowAppError } from "../../../core/utils/errors/rethrowError";
import { AppError } from "../../../core/utils/errors/AppError";
import fs from 'fs';
import path from 'path';
import prisma from "../../../core/lib/prisma";

export class PdfService {
  static async uploadPdf(data: {
    name: string;
    originalName: string;
    fileName: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
    lessonId: string;
  }) {
    try {
      // Check if lesson exists
      const lesson = await prisma.lesson.findUnique({
        where: { id: data.lessonId }
      });
      
      if (!lesson) {
        throw new AppError({
          errorType: "Not Found",
          message: "Lesson not found"
        });
      }

      return await PdfRepository.createPdf(data);
    } catch (error) {
      rethrowAppError(error, 'Failed to upload PDF');
    }
  }

  static async getPdfsByLessonId(lessonId: string) {
    try {
      return await PdfRepository.getPdfsByLessonId(lessonId);
    } catch (error) {
      rethrowAppError(error, 'Failed to fetch PDFs');
    }
  }

  static async getPdfById(id: string) {
    try {
      console.log('Getting PDF by ID:', id);
      const pdf = await PdfRepository.getPdfById(id);
      console.log('PDF from database:', pdf);
      
      if (!pdf) {
        throw new AppError({
          errorType: "Not Found",
          message: "PDF not found"
        });
      }
      return pdf;
    } catch (error) {
      console.error('Error getting PDF by ID:', error);
      rethrowAppError(error, 'Failed to fetch PDF');
    }
  }

  static async deletePdf(id: string) {
    try {
      const pdf = await PdfRepository.getPdfById(id);
      if (!pdf) {
        throw new AppError({
          errorType: "Not Found",
          message: "PDF not found"
        });
      }

      // Delete physical file
      const filePath = path.join(process.cwd(), pdf.filePath);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      // Mark as inactive in database
      await PdfRepository.deletePdf(id);
    } catch (error) {
      rethrowAppError(error, 'Failed to delete PDF');
    }
  }

  static async getAllPdfs() {
    try {
      return await PdfRepository.getAllPdfs();
    } catch (error) {
      rethrowAppError(error, 'Failed to fetch PDFs');
    }
  }
}
