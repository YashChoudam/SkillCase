import { z } from "zod";

const videoIdSchema = z.object({
  id: z.coerce.number().int().positive(),
});

const createVideoSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(255),
  description: z.string().trim().min(1, "Description is required"),
  category: z.string().trim().min(1, "Category is required").max(100),
  file_path: z.string().trim().min(1, "File path is required"),
});

const createCommentSchema = z.object({
  content: z.string().trim().min(1, "Comment is required").max(1000),
});

export { videoIdSchema, createVideoSchema, createCommentSchema };
