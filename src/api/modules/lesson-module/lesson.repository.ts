import prisma from "@/core/lib/prisma";

export class LessonRepository {
  static async createLesson(data: {
    name: string;
    code: string;
    chapterId: string;
    description?: string;
  }) {
    return await prisma.lesson.create({
      data: {
        name: data.name,
        code: data.code,
        chapterId: data.chapterId,
        description: data.description,
        isActive: true,
      },
    });
  }

  static async findAll() {
    return await prisma.lesson.findMany({
      include: {
        chapter: {
          include: {
            subject: true,
            term: true,
          },
        },
      },
    });
  }


  static async getLessonByChapterId(chapterId: string) {
    return await prisma.lesson.findMany({
      where: {
        chapterId: chapterId,
      },
      include: {
        _count: true
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

  }
}
