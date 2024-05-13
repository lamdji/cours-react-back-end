import { z } from "zod";

export const postCreationSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  description: z.string(),
  imageUrl: z.string().url().optional(),
});
