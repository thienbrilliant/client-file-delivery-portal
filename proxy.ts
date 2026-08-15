export { auth as proxy } from './auth';

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|dang-nhap).*)'],
};
