import { User } from '@domain/entities/user/User';
import { UserRepository } from '@domain/repositories/user/UserRepository';
import { logger } from '@utils/logger';

export class FindUserByIdUseCase {
  constructor(private userRepository: UserRepository) {}
  async execute(id: number): Promise<User | null> {
    try {
      const findUserById = await this.userRepository.findById(id);
      if (findUserById) {
        logger.info(`User was found id = ${findUserById?.id}`);
        return findUserById;
      } else {
        const errorMessage = 'User not found';
        logger.error(errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      const errorMessage = 'Failed to find by id user';
      logger.error(errorMessage);
      throw error;
    }
  }
}
