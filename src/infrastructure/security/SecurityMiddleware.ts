import { config } from 'configs/config';
import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

export const securityMiddleware = [
  helmet(),
  rateLimit({
    windowMs: config.rateLimit.windowMs * 60 * 1000,
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
  res.status(500).send('Something went wrong');
  next();
}
