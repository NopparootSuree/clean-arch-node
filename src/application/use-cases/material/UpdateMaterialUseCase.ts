import { Material } from '@domain/entities/material/Material';
import { MaterialRepository } from '@domain/repositories/material/MaterialRepository';
import { TransactionManager } from '@infrastructure/database/TransactionManager';
import { UpdateMaterialDto } from '@application/dtos/material/UpdateMaterialDto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { logger } from '@utils/logger';

export class UpdateMaterialUseCase {
  constructor(
    private materialRepository: MaterialRepository,
    private transactionManager: TransactionManager,
  ) {}

  async execute(id: number, materialData: UpdateMaterialDto): Promise<Material> {
    const dto = plainToClass(UpdateMaterialDto, materialData);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const warningMessage = 'Validation failed';
      logger.warn(warningMessage);
      throw new Error(warningMessage);
    }

    const findMaterialById = await this.materialRepository.findById(id);
    if (findMaterialById) {
      try {
        const updatedMaterial = await this.transactionManager.runInTransaction(async (transaction) => {
          const material = new Material(
            findMaterialById.id,
            materialData.name,
            materialData.description || null,
            materialData.quantity,
            materialData.unit,
            findMaterialById.createdAt,
            new Date(),
            null,
          );
          const updatedMaterial = await this.materialRepository.update(material, transaction);
          return updatedMaterial;
        });

        logger.info(`Material updated successfully id = ${updatedMaterial.id}`);
        return updatedMaterial;
      } catch (error) {
        const errorMessage = 'Failed to updated material';
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
