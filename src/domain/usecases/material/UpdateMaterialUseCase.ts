import { Material } from '@domain/entities/material/Material';
import { MaterialRepository } from '@domain/repositories/MaterialRepository';
import { TransactionManager } from '@infrastructure/database/TransactionManager';
import { UpdateMaterialDto } from '@interfaces/dtos/material/UpdateMaterialDto';
import { logger } from '@utils/logger';
import { DatabaseError, ERROR_CODES, NotFoundError } from '@utils/errors';

export class UpdateMaterialUseCase {
  constructor(
    private materialRepository: MaterialRepository,
    private transactionManager: TransactionManager,
  ) {}

  async execute(id: number, materialData: UpdateMaterialDto): Promise<Material> {
    try {
      const findMaterialById = await this.materialRepository.findById(id);
      if (!findMaterialById) {
        throw new NotFoundError('Material', ERROR_CODES.NF_001);
      }
      const updatedMaterial = await this.transactionManager.runInTransaction(async (transaction) => {
        const material = new Material(findMaterialById.id, materialData.name, materialData.description || null, materialData.quantity, materialData.unit, findMaterialById.createdAt, new Date(), null);
        return await this.materialRepository.update(material, transaction);
      });

      logger.info('Material updated successfully id', { materialId: updatedMaterial.id });
      return updatedMaterial;
    } catch (error) {
      if (error instanceof NotFoundError) {
        const errorCode = ERROR_CODES.NF_001;
        const errorMessage = 'Material not found';
        logger.warn(errorMessage);
        throw new NotFoundError('Material', errorCode);
      } else {
        const errorCode = ERROR_CODES.OP_002;
        const errorMessage = 'Failed to update material';
        logger.error(errorMessage, {
          code: errorCode,
          errorDetails: error instanceof Error ? error.message : 'Unknown error',
        });
        throw new DatabaseError(errorMessage, errorCode);
      }
    }
  }
}
