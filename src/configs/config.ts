import * as dotenv from 'dotenv';
dotenv.config();

//rate limit
const windowMs = process.env.WINDOW_MS ? parseInt(process.env.WINDOW_MS) * 60 * 1000 : 15 * 60 * 1000;
const statusCode = process.env.STATUS_CODE ? parseInt(process.env.STATUS_CODE) : 429;
const max = process.env.MAX ? parseInt(process.env.MAX) : 100;

export const config = {
  rateLimit: {
    windowMs,
    max,
    message: process.env.MESSAGE,
    statusCode,
  },
};
