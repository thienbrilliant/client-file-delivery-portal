import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/db/prisma';
import { verifyPassword } from '@/lib/security/password';
import { signInSchema } from '@/lib/validation/auth';

const USER_ROLES = ['ADMIN', 'CUSTOMER'] as const;
type UserRole = (typeof USER_ROLES)[number];

function isUserRole(value: unknown): value is UserRole {
  return typeof value === 'string' && USER_ROLES.includes(value as UserRole);
}

const googleEnabled = Boolean(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET);

const providers = [
  Credentials({
    name: 'credentials',
    credentials: {
      email: { label: 'Email', type: 'email' },
      password: { label: 'Mật khẩu', type: 'password' },
    },
    async authorize(rawCredentials) {
      const parsed = signInSchema.safeParse(rawCredentials);
      if (!parsed.success) return null;

      const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
      if (!user?.passwordHash || user.status !== 'ACTIVE' || user.deletedAt) return null;
      if (!(await verifyPassword(user.passwordHash, parsed.data.password))) return null;

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.avatarUrl,
        role: user.role,
        sessionVersion: user.sessionVersion,
      };
    },
  }),
  ...(googleEnabled
    ? [Google({ clientId: process.env.AUTH_GOOGLE_ID!, clientSecret: process.env.AUTH_GOOGLE_SECRET! })]
    : []),
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt', maxAge: 60 * 60 * 24 * 30 },
  providers,
  pages: { signIn: '/dang-nhap' },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google' && user.id) {
        const existing = await prisma.user.findUnique({ where: { id: user.id }, select: { status: true, deletedAt: true } });
        if (existing?.deletedAt || existing?.status === 'SUSPENDED' || existing?.status === 'DISABLED') return false;

        if (user.role === 'CUSTOMER') {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              status: 'ACTIVE',
              emailVerified: new Date(),
              customerProfile: { upsert: { create: {}, update: {} } },
            },
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.sessionVersion = typeof user.sessionVersion === 'number' ? user.sessionVersion : undefined;
      }

      if (typeof token.id === 'string') {
        const current = await prisma.user.findUnique({
          where: { id: token.id },
          select: { role: true, status: true, deletedAt: true, sessionVersion: true, name: true, email: true, avatarUrl: true },
        });

        if (!current || current.deletedAt || current.status !== 'ACTIVE') return null;
        if (typeof token.sessionVersion === 'number' && current.sessionVersion !== token.sessionVersion) return null;

        token.role = current.role;
        token.sessionVersion = current.sessionVersion;
        token.name = current.name;
        token.email = current.email;
        token.picture = current.avatarUrl;
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && typeof token.id === 'string' && isUserRole(token.role)) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    authorized({ auth: session, request }) {
      const path = request.nextUrl.pathname;
      return path === '/' || path === '/dang-nhap' || path === '/dang-ky' || path.startsWith('/api/auth/') || Boolean(session?.user);
    },
  },
  trustHost: true,
});
