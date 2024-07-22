import express from 'express';
import { PrismaClient } from '@prisma/client';
import { DatabaseMaterialRepository } from '@infrastructure/database/material/DatabaseMaterialRepository';
import { TransactionManager } from '@infrastructure/database/TransactionManager';
import { securityMiddleware, errorHandler } from '@infrastructure/security/SecurityMiddleware';
import { createMaterialRoutes } from './interfaces/routes/material/materialRoutes';

import { httpLogger } from '@utils/logger';

// Swagger
import swaggerUi from 'swagger-ui-express';
import specs from '@utils/swagger';

// Group dependency material
import { materialGroupController } from 'dependency/material';

export function createApp(prisma: PrismaClient) {
  const app = express();

  app.use(express.json());
  app.use(httpLogger);
  app.use(securityMiddleware);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

  // Dependencies
  const transactionManager = new TransactionManager(prisma);
  const materialRepository = new DatabaseMaterialRepository(prisma);

  // Dependency material
  const materialController = materialGroupController(transactionManager, materialRepository);

  // Routes
  app.use('/api/materials', createMaterialRoutes(materialController));

  // Error handling middleware
  app.use(errorHandler);

  return app;
}
