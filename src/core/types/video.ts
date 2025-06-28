import { VIDEOTYPE } from '@prisma/client';

export interface IVideo {
  id: string;
  name: string;
  description?: string | null;
  embedLink: string;
  duration?: string | null;
  date?: Date | null;
  isFree: boolean;
  thumbnail?: string | null;
  classId: number;
  videoType: VIDEOTYPE;
  updatedAt: Date;
  createdAt: Date;
  noteId?: string | null;
}
