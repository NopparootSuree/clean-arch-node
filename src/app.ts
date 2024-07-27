import express from 'express';

// Database
import { PrismaClient } from '@prisma/client';
import { DatabaseMaterialRepository } from '@infrastructure/database/material/DatabaseMaterialRepository';
import { DatabaseUserRepository } from '@infrastructure/database/user/DatabaseUserRepository';
import { TransactionManager } from '@infrastructure/database/TransactionManager';

// Route
import { createMaterialRoutes } from './interfaces/routes/material/materialRoutes';
import { createUserRoutes } from '@interfaces/routes/user/userReoute';

// Middleware
import { rateLimitMiddleware, serverErrorHandler } from '@infrastructure/security/rateLimitMiddleware';
import { httpLogger } from '@utils/logger';

// Swagger
import swaggerUi from 'swagger-ui-express';
import { materialSpecs, userSpecs } from '@utils/swagger';

// Group dependency material
import { materialDependencies } from 'dependencies/materialDependencies';
import { userDependencies } from 'dependencies/userDependencies';

export function createApp(prisma: PrismaClient) {
  const app = express();

  app.use(express.json());
  app.use(httpLogger);
  app.use(rateLimitMiddleware);

  app.use(
    '/api-docs/materials',
    swaggerUi.serve,
    swaggerUi.setup(materialSpecs, {
      explorer: true,
      swaggerOptions: {
        url: '/api-docs/materials/swagger.json',
      },
    }),
  );

  // Swagger UI for Users
  app.use(
    '/api-docs/users',
    swaggerUi.serve,
    swaggerUi.setup(userSpecs, {
      explorer: true,
      swaggerOptions: {
        url: '/api-docs/users/swagger.json',
      },
    }),
  );

  // Serve Swagger JSON
  app.get('/api-docs/materials/swagger.json', (req, res) => res.json(materialSpecs));
  app.get('/api-docs/users/swagger.json', (req, res) => res.json(userSpecs));

  // Dependencies
  const transactionManager = new TransactionManager(prisma);
  const materialRepository = new DatabaseMaterialRepository(prisma);
  const userRepository = new DatabaseUserRepository(prisma);

  // Dependency material
  const materialController = materialDependencies(transactionManager, materialRepository);
  const userController = userDependencies(transactionManager, userRepository);

  // Routes
  app.use('/api/materials', createMaterialRoutes(materialController));
  app.use('/api/users', createUserRoutes(userController));

  // Error handling middleware
  app.use(serverErrorHandler);

  return app;
}
