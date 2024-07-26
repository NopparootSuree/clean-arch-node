import { User } from '@domain/entities/user/User';
import { UserRepository } from '@domain/repositories/user/UserRepository';
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

export class FindUsersUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(options: PaginationOptions): Promise<PaginatedResult<User>> {
    try {
      const { page, limit } = options;

      const result = await this.userRepository.findAll({ page, limit });

      logger.info(`User found. Page ${page} of ${result.totalPages}`);

      return result;
    } catch (error) {
      const errorMessage = 'Failed to find users';
      logger.error(errorMessage, error);
      throw new Error(errorMessage);
    }
  }
}
