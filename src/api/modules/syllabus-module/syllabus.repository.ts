import prisma from "../../../core/lib/prisma";

export class SyllabusRepository {
    
   static async create(data:any) {
        return await prisma.syllabus.create({
          data,
          include: {
            _count: {
              select: {
                classes: true,
                users:true,
              }
            }
          }
        });
      }

      static async findByCode(code:string, excludeId: string | null = null) {
        const whereClause:{[key:string]:any} = { 
          code,
        };
        
        if (excludeId) {
          whereClause.id  = { not: excludeId };
        }
    
        return await prisma.syllabus.findFirst({
          where: whereClause
        });
      }

      static async findAll() {
        return await prisma.syllabus.findMany({
          include: {
            _count: {
              select: {
                classes: true,
                users:true,
              }
            }
          }
        });
      }

      static async findById(id: string) {
        return await prisma.syllabus.findUnique({
          where: { id },
          include: {
            _count: {
              select: {
                classes: true,
                users: true,
              }
            }
          }
        });
      }

      static async update(id: string, data: any) {
        return await prisma.syllabus.update({
          where: { id },
          data,
          include: {
            _count: {
              select: {
                classes: true,
                users: true,
              }
            }
          }
        });
      }

      static async delete(id: string) {
        return await prisma.syllabus.delete({
          where: { id }
        });
      }
    
}
