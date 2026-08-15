export const ERROR_CODES = {
  CUSTOMER_NOT_FOUND: 'CUSTOMER_NOT_FOUND',
  PROJECT_NOT_FOUND: 'PROJECT_NOT_FOUND',
  FOLDER_NOT_FOUND: 'FOLDER_NOT_FOUND',
  FILE_NOT_FOUND: 'FILE_NOT_FOUND',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_FILE: 'INVALID_FILE',
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FOLDER: 'INVALID_FOLDER',
  STORAGE_ERROR: 'STORAGE_ERROR',
  DELIVERY_NOT_FOUND: 'DELIVERY_NOT_FOUND',
  DELIVERY_REVOKED: 'DELIVERY_REVOKED',
  DELIVERY_EXPIRED: 'DELIVERY_EXPIRED',
  SHARE_LINK_NOT_FOUND: 'SHARE_LINK_NOT_FOUND',
  SHARE_LINK_EXPIRED: 'SHARE_LINK_EXPIRED',
  SHARE_LINK_REVOKED: 'SHARE_LINK_REVOKED',
  SHARE_LINK_LIMIT_REACHED: 'SHARE_LINK_LIMIT_REACHED',
  INVALID_SHARE_PASSWORD: 'INVALID_SHARE_PASSWORD',
  FILE_NOT_IN_DELIVERY: 'FILE_NOT_IN_DELIVERY',
  DOWNLOAD_NOT_ALLOWED: 'DOWNLOAD_NOT_ALLOWED',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

export class AppError extends Error {
  constructor(public readonly code: ErrorCode, message: string, public readonly status = 400) {
    super(message);
    this.name = 'AppError';
  }
}

export function errorResponse(error: unknown) {
  if (error instanceof AppError) {
    return Response.json({ data: null, error: { code: error.code, message: error.message } }, { status: error.status });
  }
  console.error(error);
  return Response.json({ data: null, error: { code: 'INTERNAL_ERROR', message: 'Đã xảy ra lỗi. Vui lòng thử lại.' } }, { status: 500 });
}
