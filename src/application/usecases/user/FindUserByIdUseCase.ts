import { User } from '@domain/entities/user/User';
import { UserRepository } from '@domain/repositories/user/UserRepository';
import { logger } from '@utils/logger';
import { NotFoundError, ERROR_CODES, DatabaseError } from '@utils/errors';

export class FindUserByIdUseCase {
  constructor(private userRepository: UserRepository) {}
  async execute(id: number): Promise<User> {
    try {
      const findUserById = await this.userRepository.findById(id);
      if (!findUserById) {
        const errorCode = ERROR_CODES.NF_001;
        const errorMessage = 'User not found';
        logger.warn(errorMessage);
        throw new NotFoundError('User', errorCode);
      } 

      logger.info('User was found', { userId: findUserById.id });
      return findUserById;
    } catch (error) {
      const errorCode = ERROR_CODES.OP_004;
      const errorMessage = 'Failed to retreive user';
      logger.error(errorMessage, {
        code: errorCode,
        errorDetails: error instanceof Error ? error.message : 'Unknown error',
      });
      throw new DatabaseError(errorMessage, errorCode);
    }
  }
}
