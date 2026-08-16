import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/prisma';
import { hashPassword } from '@/lib/security/password';
import { z } from 'zod';

const schema = z.object({
  name: z.string().trim().min(2, 'Tên phải có ít nhất 2 ký tự.').max(80),
  email: z.string().trim().email('Email không hợp lệ.').max(254),
  password: z.string().min(8, 'Mật khẩu cần ít nhất 8 ký tự.').max(128),
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Dữ liệu không hợp lệ.' }, { status: 400 });

    const email = parsed.data.email.toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) return NextResponse.json({ error: 'Email này đã được sử dụng.' }, { status: 409 });

    const passwordHash = await hashPassword(parsed.data.password);
    const user = await prisma.user.create({
      data: {
        email,
        name: parsed.data.name,
        passwordHash,
        role: 'CUSTOMER',
        status: 'ACTIVE',
        customerProfile: { create: {} },
      },
      select: { id: true, email: true, name: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Không thể tạo tài khoản lúc này.' }, { status: 500 });
  }
}
