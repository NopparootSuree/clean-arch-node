import { Material } from '@domain/entities/material/Material';
import { MaterialRepository } from '@domain/repositories/material/MaterialRepository';
import { logger } from '@utils/logger';

export class FindMaterialByIdUseCase {
  constructor(private materialRepository: MaterialRepository) {}
  async execute(id: number): Promise<Material | null> {
    try {
      const findMaterialById = await this.materialRepository.findById(id);
      if (findMaterialById) {
        logger.info(`Material was found id = ${findMaterialById?.id}`);
        return findMaterialById;
      } else {
        const errorMessage = 'Material not found';
        logger.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage = 'Failed to find by id material';
      logger.error(errorMessage);
      throw error; // Re-throw the original error
    }
  }
}
