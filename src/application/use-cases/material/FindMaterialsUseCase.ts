import { Material } from '@domain/entities/material/Material';
import { MaterialRepository } from '@domain/repositories/material/MaterialRepository';
import { logger } from '@utils/logger';

export class FindMaterialsUseCase {
  constructor(private materialRepository: MaterialRepository) {}

  async execute(): Promise<Material[]> {
    try {
      const findMaterials = await this.materialRepository.findAll();
      logger.info('Materials was found');
      return findMaterials;
    } catch (error) {
      logger.error({ error: error }, 'Failed to find materials');
      throw new Error('Failed to find materials');
    }
  }
}
