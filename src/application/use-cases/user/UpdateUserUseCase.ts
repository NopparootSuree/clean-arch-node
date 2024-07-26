import { User } from '@domain/entities/user/User';
import { UserRepository } from '@domain/repositories/user/UserRepository';
import { TransactionManager } from '@infrastructure/database/TransactionManager';
import { UpdateUserDto } from '@application/dtos/user/UpdateUserDto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { logger } from '@utils/logger';

export class UpdateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private transactionManager: TransactionManager,
  ) {}

  async execute(id: number, userData: UpdateUserDto): Promise<User> {
    const dto = plainToClass(UpdateUserDto, userData);
    const errors = await validate(dto);

    if (errors.length > 0) {
      const warningMessage = 'Validation failed';
      logger.warn(warningMessage);
      throw new Error(warningMessage);
    }

    const findUserById = await this.userRepository.findById(id);
    if (findUserById) {
      try {
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
          const updateUser = await this.userRepository.update(user, transaction);
          return updateUser;
        });

        logger.info(`User updated successfully id = ${updatedUser.id}`);
        return updatedUser;
      } catch (error) {
        const errorMessage = 'Failed to updated user';
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
