import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().min(3).max(50),
  password: z.string().min(8).max(100)
});

export const registerSchema = z.object({
  name: z.string().min(2).max(100),
  username: z.string().min(3).max(50),
  password: z.string()
    .min(8)
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
  department: z.enum(['Development', 'Support']),
  role: z.string().min(2).max(50)
});

export const scriptSchema = z.object({
  name: z.string().min(1).max(100),
  content: z.string().min(1),
  type: z.enum(['powershell', 'bash', 'batch']),
  category: z.string().min(1),
  description: z.string().optional()
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type ScriptInput = z.infer<typeof scriptSchema>;