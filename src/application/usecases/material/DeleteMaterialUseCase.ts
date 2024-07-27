import { Material } from '@domain/entities/material/Material';
import { MaterialRepository } from '@domain/repositories/material/MaterialRepository';
import { TransactionManager } from '@infrastructure/database/TransactionManager';
import { logger } from '@utils/logger';
import { DatabaseError, NotFoundError, ERROR_CODES } from '@utils/errors';

export class DeleteMaterialUseCase {
  constructor(
    private materialRepository: MaterialRepository,
    private transactionManager: TransactionManager,
  ) {}

  async execute(id: number): Promise<Material> {
    const material = await this.materialRepository.findById(id);
    if (!material) {
      const errorMessage = 'Material not found';
      logger.warn(errorMessage, { materialId: id });
      throw new NotFoundError('Material', ERROR_CODES.NF_001);
    }

    try {
      const deletedMaterial = await this.transactionManager.runInTransaction(async (transaction) => {
        material.deletedAt = new Date();
        return await this.materialRepository.delete(material, transaction);
      });

      logger.info(`Material deleted successfully`, { materialId: deletedMaterial.id });
      return deletedMaterial;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      } else {
        const errorCode = ERROR_CODES.OP_003;
        const errorMessage = 'Failed to delete material';
        logger.error(errorMessage, {
          code: errorCode,
          resourceId: id,
          errorDetails: error instanceof Error ? error.message : 'Unknown error',
        });
        throw new DatabaseError(errorMessage, errorCode);
      }
    }
  }
}
