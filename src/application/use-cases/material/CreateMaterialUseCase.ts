import { Material } from '../../../domain/entities/material/Material';
import { MaterialRepository } from '../../../domain/repositories/material/MaterialRepository';
import { TransactionManager } from '../../../infrastructure/database/TransactionManager';
import { CreateMaterialDto } from '../../dtos/material/CreateMaterialDto';
import { validate } from 'class-validator';

export class CreateMaterialUseCase {
  constructor(
    private materialRepository: MaterialRepository,
    private transactionManager: TransactionManager
  ) {}

  async execute(materialData: CreateMaterialDto): Promise<Material> {
    // Validate input
    const errors = await validate(materialData);
    if (errors.length > 0) {
      throw new Error(errors.map(error => Object.values(error.constraints!)).join(', '));
    } 

    return this.transactionManager.runInTransaction(async (transaction) => {
      const material = new Material(
        0,
        materialData.name,
        materialData.description || null,
        materialData.quantity,
        materialData.unit,
        new Date(),
        new Date(),
        null
      );

      return this.materialRepository.create(material, transaction);
    });
  }
}