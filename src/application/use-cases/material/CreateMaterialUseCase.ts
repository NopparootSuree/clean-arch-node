import { Material } from '@domain/entities/material/Material';
import { MaterialRepository } from '@domain/repositories/material/MaterialRepository';
import { TransactionManager } from '@infrastructure/database/TransactionManager';
import { CreateMaterialDto } from '@application/dtos/material/CreateMaterialDto';
import { validate } from 'class-validator';
import { logger } from '@utils/logger';

export class CreateMaterialUseCase {
  constructor(
    private materialRepository: MaterialRepository,
    private transactionManager: TransactionManager,
  ) {}

  async execute(materialData: CreateMaterialDto): Promise<Material> {
    try {
      // Validate input
      const errors = await validate(materialData);
      if (errors.length > 0) {
        const errorMessage = `Validation failed: ${errors.map((error) => Object.values(error.constraints!)).join(', ')}`;
        logger.error({ materialData }, errorMessage);
        throw new Error(errorMessage);
      }

      return this.transactionManager.runInTransaction(async (transaction) => {
        const material = new Material(0, materialData.name, materialData.description ?? null, materialData.quantity, materialData.unit, new Date(), new Date(), null);

        const createdMaterial = await this.materialRepository.create(material, transaction);
        logger.info({ materialId: createdMaterial.id }, 'Material created successfully');
        return createdMaterial;
      });
    } catch (error) {
      logger.error({ error, materialData }, 'Failed to create material');
      throw new Error('Failed to create material');
    }
  }
}
