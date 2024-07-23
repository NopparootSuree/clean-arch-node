import { Material } from '@domain/entities/material/Material';
import { MaterialRepository } from '@domain/repositories/material/MaterialRepository';
import { TransactionManager } from '@infrastructure/database/TransactionManager';
import { logger } from '@utils/logger';

export class DeleteMaterialUseCase {
  constructor(
    private materialRepository: MaterialRepository,
    private transactionManager: TransactionManager,
  ) {}

  async execute(id: number): Promise<Material> {
    const material = await this.materialRepository.findById(id);
    if (material) {
      try {
        const deletedMaterial = await this.transactionManager.runInTransaction(async (transaction) => {
          material.deletedAt = new Date();
          const deletedMaterial = await this.materialRepository.delete(material, transaction);
          return deletedMaterial;
        });

        logger.info(`Material deleted successfully id = ${deletedMaterial.id}`);
        return deletedMaterial;
      } catch (error) {
        const errorMessage = 'Failed to delete material';
        logger.error(errorMessage);
        throw new Error(errorMessage);
      }
    } else {
      const warningMessage = 'Material not found';
      logger.warn(warningMessage);
      throw new Error(warningMessage);
    }
  }
}
