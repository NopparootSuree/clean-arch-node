import { config } from '@configs/config';
import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

export const rateLimitMiddleware = [
  helmet(),
  rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    handler: (req, res) => {
      res.status(config.rateLimit.statusCode).json({
        error: config.rateLimit.message,
      });
    },
  }),
];

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong' });
  next();
}
