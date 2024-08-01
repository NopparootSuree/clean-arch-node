import { DatabaseUserRepository } from '@infrastructure/database/user/DatabaseUserRepository';
import { TransactionManager } from '@infrastructure/database/TransactionManager';
import { CreateUserUseCase } from '@domain/usecases/user/CreateUserUseCase';
import { FindUsersUseCase } from '@domain/usecases/user/FindUsersUseCase';
import { FindUserByIdUseCase } from '@domain/usecases/user/FindUserByIdUseCase';
import { UpdateUserUseCase } from '@domain/usecases/user/UpdateUserUseCase';
import { DeleteUserUseCase } from '@domain/usecases/user/DeleteUserUseCase';
import { UserSerializer } from '@interfaces/serializers/user/UserSerializer';
import { UserController } from '@interfaces/controllers/user/UserController';

export function userDependencies(transactionManager: TransactionManager, userRepository: DatabaseUserRepository) {
  const createUserUseCase = new CreateUserUseCase(userRepository, transactionManager);
  const findUsersUseCase = new FindUsersUseCase(userRepository);
  const findUserByIdUseCase = new FindUserByIdUseCase(userRepository);
  const updateUserUseCase = new UpdateUserUseCase(userRepository, transactionManager);
  const deleteUserUseCase = new DeleteUserUseCase(userRepository, transactionManager);
  const userSerializer = new UserSerializer();
  return new UserController(createUserUseCase, findUsersUseCase, findUserByIdUseCase, updateUserUseCase, deleteUserUseCase, userSerializer);
}
