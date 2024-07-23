import { Material } from '@domain/entities/material/Material';
import { MaterialRepository } from '@domain/repositories/material/MaterialRepository';
import { TransactionManager } from '@infrastructure/database/TransactionManager';
import { CreateMaterialDto } from '@application/dtos/material/CreateMaterialDto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { logger } from '@utils/logger';

export class CreateMaterialUseCase {
  constructor(
    private materialRepository: MaterialRepository,
    private transactionManager: TransactionManager,
  ) {}

  async execute(materialData: CreateMaterialDto): Promise<Material> {
    const dto = plainToClass(CreateMaterialDto, materialData);
    const errors = await validate(dto);
    if (errors.length > 0) {
      const warningMessage = 'Validation failed';
      logger.warn(warningMessage);
      throw new Error(warningMessage);
    }
    try {
      const createdMaterial = await this.transactionManager.runInTransaction(async (transaction) => {
        const material = new Material(0, dto.name, dto.description ?? null, dto.quantity, dto.unit, new Date(), new Date(), null);
        const createdMaterial = await this.materialRepository.create(material, transaction);
        return createdMaterial;
      });

      logger.info(`Material created successfully id = ${createdMaterial.id}`);
      return createdMaterial;
    } catch (error) {
      const errorMessage = 'Failed to create material';
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }
  }
}
