import { PrismaClient } from '@prisma/client';
import { createApp } from './app';
import { logger } from '@utils/logger';

const prisma = new PrismaClient();
const app = createApp(prisma);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
