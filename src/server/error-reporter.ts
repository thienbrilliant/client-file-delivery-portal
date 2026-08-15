export type ErrorContext = { route?: string; actorId?: string; requestId?: string };

export function reportError(error: unknown, context: ErrorContext = {}) {
  const normalized = error instanceof Error ? { name: error.name, message: error.message, stack: process.env.NODE_ENV === 'production' ? undefined : error.stack } : { name: 'UnknownError', message: 'Unknown error' };
  console.error(JSON.stringify({ level: 'error', event: 'application.error', error: normalized, context, timestamp: new Date().toISOString() }));
}
