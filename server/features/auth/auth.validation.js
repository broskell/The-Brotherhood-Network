import { z } from 'zod';

export const registerSchema = z.object({
  fullName: z.string().min(1, 'Full name is required').max(50),
  username: z.string().min(3, 'Username must be at least 3 characters long').max(30).toLowerCase(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});
