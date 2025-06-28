import { z } from 'zod';
import { VIDEOTYPE } from '@prisma/client';

// Base schema with common fields
const videoBaseSchema = {
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional().nullable(),
  embedLink: z.string().url('Invalid video URL'),
  duration: z.string().optional().nullable(),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Invalid date format',
  }),
  isFree: z.boolean(),
  thumbnail: z.string().url('Invalid thumbnail URL').optional().nullable(),
  classId: z.number(),
  videoType: z.nativeEnum(VIDEOTYPE),
  noteId: z.string().uuid().optional().nullable(),
  code:z.string().min(2,{message:"Code must be at least 2 characters long"})
};

// Schema for creating a new video
export const CreateVideoSchema = z.object({
  ...videoBaseSchema
});

// Schema for updating an existing video
export const UpdateVideoSchema = z.object({
  ...videoBaseSchema
}).partial();

// Response schema (includes auto-generated fields)
export const VideoResponseSchema = z.object({
  ...videoBaseSchema,
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date()
});

// TypeScript types derived from schemas
export type CreateVideoDto = z.infer<typeof CreateVideoSchema>;
export type UpdateVideoDto = z.infer<typeof UpdateVideoSchema>;
export type VideoResponseDto = z.infer<typeof VideoResponseSchema>;
