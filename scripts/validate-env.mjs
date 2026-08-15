const required = ['DATABASE_URL', 'AUTH_SECRET'];
const missing = required.filter((name) => !process.env[name]);
const provider = (process.env.STORAGE_PROVIDER ?? 'local').toLowerCase();
if (process.env.NODE_ENV === 'production') {
  if (provider !== 'local') missing.push(...['S3_BUCKET', 'S3_ACCESS_KEY', 'S3_SECRET_KEY'].filter((name) => !process.env[name]));
  const emailProvider = (process.env.EMAIL_PROVIDER ?? 'console').toLowerCase();
  if (emailProvider === 'resend') missing.push(...['RESEND_API_KEY', 'EMAIL_FROM'].filter((name) => !process.env[name]));
  if (missing.length) {
    console.error(`Missing required production environment variables: ${[...new Set(missing)].join(', ')}`);
    process.exit(1);
  }
}
