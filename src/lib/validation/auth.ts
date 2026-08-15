import { z } from 'zod';
export const signInSchema = z.object({ email: z.string().trim().email('Email không hợp lệ.').max(254), password: z.string().min(1, 'Vui lòng nhập mật khẩu.').max(128) });
export type SignInInput = z.infer<typeof signInSchema>;
