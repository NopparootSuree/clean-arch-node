import { DatabaseUserRepository } from '@infrastructure/database/DatabaseUserRepository';
import { TransactionManager } from '@infrastructure/database/TransactionManager';
import { CreateUserUseCase, FindUsersUseCase, FindUserByIdUseCase, UpdateUserUseCase, DeleteUserUseCase } from '@domain/usecases/user';
import { UserSerializer } from '@interfaces/serializers/UserSerializer';
import { UserController } from '@interfaces/controllers/UserController';

export function userDependencies(transactionManager: TransactionManager, userRepository: DatabaseUserRepository) {
  const createUserUseCase = new CreateUserUseCase(userRepository, transactionManager);
  const findUsersUseCase = new FindUsersUseCase(userRepository);
  const findUserByIdUseCase = new FindUserByIdUseCase(userRepository);
  const updateUserUseCase = new UpdateUserUseCase(userRepository, transactionManager);
  const deleteUserUseCase = new DeleteUserUseCase(userRepository, transactionManager);
  const userSerializer = new UserSerializer();
  return new UserController(createUserUseCase, findUsersUseCase, findUserByIdUseCase, updateUserUseCase, deleteUserUseCase, userSerializer);
}
