import { User } from '@domain/entities/user/User';
import { UserRepository } from '@domain/repositories/user/UserRepository';
import { CreateUserDto } from '@application/dtos/user/CreateUserDto';
import { TransactionManager } from '@infrastructure/database/TransactionManager';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { logger } from '@utils/logger';

export class CreateUserUseCase {
  constructor(
    private userRepository: UserRepository,
    private transactionManager: TransactionManager,
  ) {}

  async execute(userData: CreateUserDto): Promise<User> {
    const dto = plainToClass(CreateUserDto, userData);
    const error = await validate(dto);
    if (error.length > 0) {
      const warningMessage = 'Validation failed';
      logger.warn(warningMessage);
      throw new Error(warningMessage);
    }

    try {
      const createdUser = await this.transactionManager.runInTransaction(async (transaction) => {
        const user = new User(0, dto.username, dto.firstName, dto.lastName, dto.phone ?? null, dto.department ?? null, new Date(), new Date(), null, dto.role);
        const createdUser = await this.userRepository.create(user, transaction);
        return createdUser;
      });

      logger.info(`user created successfully id = ${createdUser.id}`);
      return createdUser;
    } catch (error) {
      const errorMessage = 'Failed to create user';
      logger.error(errorMessage);
      throw new Error(errorMessage);
    }
  }
}
