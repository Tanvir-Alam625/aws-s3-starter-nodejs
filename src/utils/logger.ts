import { config } from '../config/env';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

function log(level: LogLevel, message: unknown, ...meta: unknown[]): void {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

  if (level === 'debug' && config.env === 'production') return;

  // eslint-disable-next-line no-console
  console[level === 'debug' ? 'log' : level](prefix, message, ...meta);
}

export const logger = {
  info: (message: unknown, ...meta: unknown[]) => log('info', message, ...meta),
  warn: (message: unknown, ...meta: unknown[]) => log('warn', message, ...meta),
  error: (message: unknown, ...meta: unknown[]) => log('error', message, ...meta),
  debug: (message: unknown, ...meta: unknown[]) => log('debug', message, ...meta),
};
