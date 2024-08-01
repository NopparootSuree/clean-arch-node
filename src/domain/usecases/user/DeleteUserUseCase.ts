import { User } from '@domain/entities/user/User';
import { UserRepository } from '@domain/repositories/UserRepository';
import { TransactionManager } from '@infrastructure/database/TransactionManager';
import { NotFoundError, DatabaseError, ERROR_CODES } from '@utils/errors';
import { logger } from '@utils/logger';

export class DeleteUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private transactionManager: TransactionManager,
  ) {}

  async execute(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      const errorMessage = 'User not found';
      logger.warn(errorMessage);
      throw new NotFoundError('User', ERROR_CODES.NF_001);
    }

    try {
      const deletedUser = await this.transactionManager.runInTransaction(async (transaction) => {
        user.deletedAt = new Date();
        return await this.userRepository.delete(user, transaction);
      });

      logger.info('User deleted successfully', { userId: deletedUser.id });
      return deletedUser;
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      } else {
        const errorCode = ERROR_CODES.OP_003;
        const errorMessage = 'Failed to delete user';
        logger.error(errorMessage, {
          code: errorCode,
          resourceId: id,
          errorDetails: error instanceof Error ? error.message : 'Unknown error',
        });
        throw new DatabaseError(errorMessage, errorCode);
      }
    }
  }
}
