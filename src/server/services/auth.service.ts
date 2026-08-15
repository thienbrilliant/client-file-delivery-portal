import { prisma } from '@/lib/db/prisma';
import { verifyPassword } from '@/lib/security/password';
export async function authenticateWithPassword(email: string, password: string) { const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } }); if (!user?.passwordHash) return null; const valid = await verifyPassword(user.passwordHash, password); return valid ? user : null; }
