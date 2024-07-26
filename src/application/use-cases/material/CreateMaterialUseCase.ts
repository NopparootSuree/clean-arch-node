import { Material } from '@domain/entities/material/Material';
import { MaterialRepository } from '@domain/repositories/material/MaterialRepository';
import { TransactionManager } from '@infrastructure/database/TransactionManager';
import { CreateMaterialDto } from '@application/dtos/material/CreateMaterialDto';
import { validate } from 'class-validator';
import { logger } from '@utils/logger';
import { ValidationError, DatabaseError, ERROR_CODES } from '@utils/errors';

export class CreateMaterialUseCase {
  constructor(
    private materialRepository: MaterialRepository,
    private transactionManager: TransactionManager,
  ) {}

  async execute(materialData: CreateMaterialDto): Promise<Material> {
    const errors = await validate(materialData);
    if (errors.length > 0) {
      logger.warn('Validation failed', {
        code: ERROR_CODES.VAL_001,
        errors: errors.map((e) => ({ property: e.property, constraints: e.constraints })),
      });
      throw new ValidationError(errors);
    }

    try {
      const createdMaterial = await this.transactionManager.runInTransaction(async (transaction) => {
        const material = new Material(0, materialData.name, materialData.description ?? null, materialData.quantity, materialData.unit, new Date(), new Date(), null);
        return await this.materialRepository.create(material, transaction);
      });

      logger.info('Material created successfully', { materialId: createdMaterial.id });
      return createdMaterial;
    } catch (error) {
      const errorCode = ERROR_CODES.OP_001;
      const errorMessage = 'Failed to create material';
      logger.error(errorMessage, {
        code: errorCode,
        errorDetails: error instanceof Error ? error.message : 'Unknown error',
      });
      throw new DatabaseError(errorMessage, errorCode);
    }
  }
}
