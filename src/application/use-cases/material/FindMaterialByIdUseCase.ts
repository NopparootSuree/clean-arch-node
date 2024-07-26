import { Material } from '@domain/entities/material/Material';
import { MaterialRepository } from '@domain/repositories/material/MaterialRepository';
import { logger } from '@utils/logger';
import { DatabaseError, ERROR_CODES, NotFoundError } from '@utils/errors';

export class FindMaterialByIdUseCase {
  constructor(private materialRepository: MaterialRepository) {}
  async execute(id: number): Promise<Material> {
    try {
      const findMaterialById = await this.materialRepository.findById(id);
      if (!findMaterialById) {
        const errorCode = ERROR_CODES.NF_001;
        const errorMessage = 'Material not found';
        logger.warn(errorMessage);
        throw new NotFoundError('Material', errorCode);
      }

      logger.info('Material was found id =', { materialId: findMaterialById.id });
      return findMaterialById;
    } catch (error) {
      const errorCode = ERROR_CODES.OP_004;
      const errorMessage = 'Failed to retreive material';
      logger.error(errorMessage, {
        code: errorCode,
        errorDetails: error instanceof Error ? error.message : 'Unknown error',
      });
      throw new DatabaseError(errorMessage, errorCode);
    }
  }
}
