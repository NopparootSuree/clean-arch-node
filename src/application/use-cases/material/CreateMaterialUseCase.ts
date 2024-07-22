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
    try {
      const dto = plainToClass(CreateMaterialDto, materialData);
      const errors = await validate(dto);
      if (errors.length > 0) {
        const errorMessages = errors.map((error) => Object.values(error.constraints || {}).join(', ')).join('; ');
        const errorMessage = `Validation failed: ${errorMessages}`;
        logger.error({ materialData }, errorMessage);
        throw new Error(errorMessage);
      }

      return await this.transactionManager.runInTransaction(async (transaction) => {
        const material = new Material(0, dto.name, dto.description ?? null, dto.quantity, dto.unit, new Date(), new Date(), null);
        const createdMaterial = await this.materialRepository.create(material, transaction);
        logger.info(`Material created successfully id = ${createdMaterial.id}`);
        return createdMaterial;
      });
    } catch (error) {
      logger.error({ error, materialData }, 'Failed to create material');
      throw error;
    }
  }
}
