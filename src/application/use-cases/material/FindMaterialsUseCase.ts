import { Material } from '@domain/entities/material/Material';
import { MaterialRepository } from '@domain/repositories/material/MaterialRepository';
import { logger } from '@utils/logger';

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

      logger.info(`Materials found. Page ${page} of ${result.totalPages}`);

      return result;
    } catch (error) {
      const errorMessage = 'Failed to find materials';
      logger.error(errorMessage, error);
      throw new Error(errorMessage);
    }
  }
}
