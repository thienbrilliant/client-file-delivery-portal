import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/db/prisma';
import { verifyPassword } from '@/lib/security/password';
import { signInSchema } from '@/lib/validation/auth';

const USER_ROLES = ['ADMIN', 'CUSTOM