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
  await new Promise<void>((resolve) => {
    transport.on('close', resolve);
    transport.end();
  });
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
    return `${req.method} ${req.originalUrl} ${res.statusCode}`;
  },
  customErrorMessage: (req: Request, res: Response) => {
    return `${req.method} ${req.originalUrl} ${res.statusCode}`;
  },
  // ปิดการแสดงข้อมูล request และ response
  serializers: {
    req: () => undefined,
    res: () => undefined,
    responseTime: () => undefined,
  },
});
