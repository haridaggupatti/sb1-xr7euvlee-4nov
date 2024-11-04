import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['admin', 'student', 'instructor', 'parent']).default('student')
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  role: z.enum(['admin', 'student', 'instructor', 'parent'])
});

export const courseSchema = z.object({
  title: z.string().min(3),
  description: z.string(),
  modules: z.array(z.object({
    title: z.string(),
    lessons: z.array(z.object({
      title: z.string(),
      videoUrl: z.string().optional(),
      content: z.string()
    }))
  })).optional()
});