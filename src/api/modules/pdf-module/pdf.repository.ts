import prisma from "../../../core/lib/prisma";
import { Pdf } from "@prisma/client";

export class PdfRepository {
  static async createPdf(data: {
    name: string;
    originalName: string;
    fileName: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
    lessonId: string;
  }): Promise<Pdf> {
    return await prisma.pdf.create({
      data: {
        name: data.name,
        originalName: data.originalName,
        fileName: data.fileName,
        filePath: data.filePath,
        fileSize: data.fileSize,
        mimeType: data.mimeType,
        lessonId: data.lessonId,
      },
    });
  }

  static async getPdfsByLessonId(lessonId: string): Promise<Pdf[]> {
    return await prisma.pdf.findMany({
      where: {
        lessonId: lessonId,
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  static async getPdfById(id: string): Promise<Pdf | null> {
    return await prisma.pdf.findUnique({
      where: {
        id: id,
        isActive: true,
      },
    });
  }

  static async deletePdf(id: string): Promise<void> {
    await prisma.pdf.update({
      where: { id },
      data: { isActive: false },
    });
  }

  static async getAllPdfs(): Promise<Pdf[]> {
    return await prisma.pdf.findMany({
      where: {
        isActive: true,
      },
      include: {
        lesson: {
          include: {
            chapter: {
              include: {
                subject: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
