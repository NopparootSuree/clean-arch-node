import { User } from '@domain/entities/user/User';
import { UserRepository } from '@domain/repositories/user/UserRepository';
import { logger } from '@utils/logger';
import { DatabaseError, ERROR_CODES } from '@utils/errors';

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

export class FindUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(options: PaginationOptions): Promise<PaginatedResult<User>> {
    try { 
      const { page, limit } = options;
      const result = await this.userRepository.findAll({ page, limit });
      logger.info('Users found', {
        page: result.page,
        totalPages: result.totalPages,
        totalItems: result.total,
      });
      return result;
    } catch (error) {
      const errorCode = ERROR_CODES.OP_004;
      const errorMessage = 'Failed to retrieve users';
      logger.error(errorMessage, {
        code: errorCode,
        errorDetails: error instanceof Error ? error.message : 'Unknown error',
      });
      throw new DatabaseError(errorMessage, errorCode);
    }
  }
}
