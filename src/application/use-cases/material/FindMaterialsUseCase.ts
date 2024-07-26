import { Material } from '@domain/entities/material/Material';
import { MaterialRepository } from '@domain/repositories/material/MaterialRepository';
import { logger } from '@utils/logger';
import { ERROR_CODES, DatabaseError } from '@utils/errors';

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class FindMaterialsUseCase {
  constructor(private materialRepository: MaterialRepository) {}

  async execute(options: PaginationOptions): Promise<PaginatedResult<Material>> {
    try {
      const { page, limit } = options;
      const result = await this.materialRepository.findAll({ page, limit });
      logger.info('Materials found', {
        page: result.page,
        totalPages: result.totalPages,
        totalItems: result.total,
      });
      return result;
    } catch (error) {
      const errorCode = ERROR_CODES.OP_004;
      const errorMessage = 'Failed to retrieve materials';
      logger.error(errorMessage, {
        code: errorCode,
        errorDetails: error instanceof Error ? error.message : 'Unknown error',
      });
      throw new DatabaseError(errorMessage, errorCode);
    }
  }
}
