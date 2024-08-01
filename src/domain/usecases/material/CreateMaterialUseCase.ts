import { Material } from '@domain/entities/material/Material';
import { MaterialRepository } from '@domain/repositories/MaterialRepository';
import { TransactionManager } from '@infrastructure/database/TransactionManager';
import { CreateMaterialDto } from '@interfaces/dtos/material/CreateMaterialDto';
import { logger } from '@configs/logger.config';
import { DatabaseError, ERROR_CODES } from '@utils/errors';

export class CreateMaterialUseCase {
  constructor(
    private materialRepository: MaterialRepository,
    private transactionManager: TransactionManager,
  ) {}

  async execute(materialData: CreateMaterialDto): Promise<Material> {
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
