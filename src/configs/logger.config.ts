import pino from 'pino';
import pinoHttp from 'pino-http';
import { Request, Response } from 'express';

const transport = pino.transport({
  target: 'pino-pretty',
  options: {
    colorize: true,
    translateTime: 'SYS:yyyy-mm-dd HH:MM:ss',
    ignore: 'pid,hostname',
  },
});

export const logger = pino(
  {
    level: process.env.LOG_LEVEL || 'info',
  },
  transport,
);

// เพิ่มฟังก์ชันสำหรับ cleanup
export async function closeLogger() {
  if (transport) {
    await new Promise<void>((resolve) => {
      transport.on('close', resolve);
      transport.end();
    });
  }
  if (logger) {
    await logger.flush();
  }
}

function colorStatusCode(statusCode: number): string {
  if (statusCode < 200) return `\x1b[34m${statusCode}\x1b[0m`; // Blue
  if (statusCode < 300) return `\x1b[32m${statusCode}\x1b[0m`; // Green
  if (statusCode < 400) return `\x1b[36m${statusCode}\x1b[0m`; // Cyan
  if (statusCode < 500) return `\x1b[33m${statusCode}\x1b[0m`; // Yellow
  return `\x1b[31m${statusCode}\x1b[0m`; // Red
}

export const httpLogger = pinoHttp({
  logger,
  customLogLevel: (req, res, err) => {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn';
    } else if (res.statusCode >= 500 || err) {
      return 'error';
    }
    return 'info';
  },
  customSuccessMessage: (req: Request, res: Response) => {
    return `${req.method} ${colorStatusCode(res.statusCode)} \x1b[32m${req.originalUrl}\x1b[0m `;
  },
  customErrorMessage: (req: Request, res: Response) => {
    return `${req.method} ${colorStatusCode(res.statusCode)} \x1b[32m${req.originalUrl}\x1b[0m `;
  },
  // ปิดการแสดงข้อมูล request และ response
  serializers: {
    req: () => undefined,
    res: () => undefined,
    responseTime: () => undefined,
  },
});
