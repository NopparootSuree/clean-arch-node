import { User } from '@domain/entities/user/User';
import { UserRepository } from '@domain/repositories/UserRepository';
import { CreateUserDto } from '@interfaces/dtos/user/CreateUserDto';
import { TransactionManager } from '@infrastructure/database/TransactionManager';
import { logger } from '@configs/logger.config';
import { DatabaseError, ERROR_CODES } from '@utils/errors';

export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private transactionManager: TransactionManager,
  ) {}

  async execute(userData: CreateUserDto): Promise<User> {
    try {
      const createdUser = await this.transactionManager.runInTransaction(async (transaction) => {
        const user = new User(0, userData.username, userData.firstName, userData.lastName, userData.phone ?? null, userData.department ?? null, new Date(), null, null, userData.role);
        return await this.userRepository.create(user, transaction);
      });

      logger.info('User created successfully', { userId: createdUser.id });
      return createdUser;
    } catch (error) {
      const errorCode = ERROR_CODES.OP_001;
      const errorMessage = 'Failed to create user';
      logger.error(errorMessage, {
        code: errorCode,
        errorDetails: error instanceof Error ? error.message : 'Unknown error',
      });
      throw new DatabaseError(errorMessage, errorCode);
    }
  }
}
