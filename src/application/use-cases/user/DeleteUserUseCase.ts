import { User } from '@domain/entities/user/User';
import { UserRepository } from '@domain/repositories/user/UserRepository';
import { TransactionManager } from '@infrastructure/database/TransactionManager';
import { logger } from '@utils/logger';

export class DeleteUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private transactionManager: TransactionManager,
  ) {}

  async execute(id: number): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (user) {
      try {
        const deletedUser = await this.transactionManager.runInTransaction(async (transaction) => {
          user.deletedAt = new Date();
          const deletedUser = await this.userRepository.delete(user, transaction);
          return deletedUser;
        });

        logger.info(`User deleted successfully id = ${deletedUser.id}`);
        return deletedUser;
      } catch (error) {
        const errorMessage = 'Failed to delete user';
        logger.error(errorMessage);
        throw new Error(errorMessage);
      }
    } else {
      const warningMessage = 'User not found';
      logger.warn(warningMessage);
      throw new Error(warningMessage);
    }
  }
}
