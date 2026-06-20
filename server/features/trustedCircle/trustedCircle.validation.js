import { z } from 'zod';

export const requestSchema = z.object({
  receiverId: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid receiver ID format'),
});
