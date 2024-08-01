import express from 'express';
import path from 'path';

// Database
import { PrismaClient } from '@prisma/client';
import { DatabaseMaterialRepository } from '@infrastructure/database/DatabaseMaterialRepository';
import { DatabaseUserRepository } from '@infrastructure/database/DatabaseUserRepository';
import { TransactionManager } from '@infrastructure/database/TransactionManager';

// Route
import { materialRoutes, userRoutes } from './interfaces/routes';

// Middleware
import { rateLimitMiddleware, serverErrorHandler } from '@infrastructure/security/rateLimitMiddleware';

// Logger
import { httpLogger } from '@configs/logger.config';

// Swagger
import { setupSwagger } from '@configs/swagger.config';

// Group dependency material
import { materialDependencies, userDependencies } from 'di';

export function createApp(prisma: PrismaClient) {
  const app = express();

  app.use(express.json());
  app.use(httpLogger);
  app.use(rateLimitMiddleware);

  // ปรับ path ให้ชี้ไปยัง root ของโปรเจค
  const rootDir = path.join(__dirname, '..');

  // Serve static files
  app.use(express.static(path.join(rootDir, 'public')));

  // Main API docs page (HTML)
  app.get('/api-docs', (req, res) => {
    res.sendFile(path.join(rootDir, 'public', 'api-docs-index.html'));
  });

  // Setup Swagger
  setupSwagger(app);

  // Dependencies
  const transactionManager = new TransactionManager(prisma);
  const materialRepository = new DatabaseMaterialRepository(prisma);
  const userRepository = new DatabaseUserRepository(prisma);

  // Controller
  const materialController = materialDependencies(transactionManager, materialRepository);
  const userController = userDependencies(transactionManager, userRepository);

  // Routes
  app.use('/api/materials', materialRoutes(materialController));
  app.use('/api/users', userRoutes(userController));

  // Error handling middleware
  app.use(serverErrorHandler);

  return app;
}
