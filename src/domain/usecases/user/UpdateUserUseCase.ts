import { User } from '@domain/entities/user/User';
import { UserRepository } from '@domain/repositories/user/UserRepository';
import { TransactionManager } from '@infrastructure/database/TransactionManager';
import { UpdateUserDto } from '@interfaces/dtos/user/UpdateUserDto';
import { NotFoundError, ERROR_CODES, DatabaseError } from '@utils/errors';
import { logger } from '@utils/logger';

export class UpdateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private transactionManager: TransactionManager,
  ) {}

  async execute(id: number, userData: UpdateUserDto): Promise<User> {
    try {
      const findUserById = await this.userRepository.findById(id);
      if (!findUserById) {
        throw new NotFoundError('User', ERROR_CODES.NF_001);
      }
      const updatedUser = await this.transactionManager.runInTransaction(async (transaction) => {
        const user = new User(
          findUserById.id,
          findUserById.username,
          userData.firstName,
          userData.lastName,
          userData.phone,
          userData.department || null,
          findUserById.createdAt,
          new Date(),
          null,
          userData.role,
        );
        return await this.userRepository.update(user, transaction);
      });

      logger.info('User updated successfully', { userId: updatedUser.id });
      return updatedUser;
    } catch (error) {
      if (error instanceof NotFoundError) {
        const errorCode = ERROR_CODES.NF_001;
        const errorMessage = 'User not found';
        logger.warn(errorMessage);
        throw new NotFoundError('User', errorCode);
      } else {
        const errorCode = ERROR_CODES.OP_002;
        const errorMessage = 'Failed to update user';
        logger.error(errorMessage, {
          code: errorCode,
          errorDetails: error instanceof Error ? error.message : 'Unknown error',
        });
        throw new DatabaseError(errorMessage, errorCode);
      }
    }
  }
}
