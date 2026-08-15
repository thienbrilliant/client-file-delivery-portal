type LogContext = Record<string, string | number | boolean | null | undefined>;

function write(level: 'info' | 'warn' | 'error', event: string, context: LogContext = {}) {
  const payload = { level, event, ...context, timestamp: new Date().toISOString() };
  const line = JSON.stringify(payload);
  if (level === 'error') console.error(line); else if (level === 'warn') console.warn(line); else console.info(line);
}

export const logger = {
  info: (event: string, context?: LogContext) => write('info', event, context),
  warn: (event: string, context?: LogContext) => write('warn', event, context),
  error: (event: string, context?: LogContext) => write('error', event, context),
};
