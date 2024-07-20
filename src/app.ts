import express from 'express';
import { PrismaClient } from '@prisma/client';
import { DatabaseMaterialRepository } from './infrastructure/database/material/DatabaseMaterialRepository';
import { TransactionManager } from './infrastructure/database/TransactionManager';
import { CreateMaterialUseCase } from './application/use-cases/material/CreateMaterialUseCase';
import { MaterialController } from './interfaces/controllers/MaterialController';
import { MaterialSerializer } from './interfaces/serializers/MaterialSerializer';
import { securityMiddleware, errorHandler } from './infrastructure/security/SecurityMiddleware';

export function createApp(prisma: PrismaClient) {
  const app = express();

  app.use(express.json());
  app.use(securityMiddleware);

  // Dependencies
  const transactionManager = new TransactionManager(prisma);
  const materialRepository = new DatabaseMaterialRepository(prisma);
  const createMaterialUseCase = new CreateMaterialUseCase(materialRepository, transactionManager);
  const materialSerializer = new MaterialSerializer();
  const materialController = new MaterialController(createMaterialUseCase, materialSerializer);

  // Routes
  app.post('/api/materials', (req, res) => materialController.createMaterial(req, res));

  // Error handling middleware
  app.use(errorHandler);

  return app;
}