import { DatabaseUserRepository } from "@infrastructure/database/user/DatabaseUserRepository";
import { TransactionManager } from "@infrastructure/database/TransactionManager";
import { CreateUserUseCase } from "@application/usecases/user/CreateUserUseCase";
import { FindUsersUseCase } from "@application/usecases/user/FindUsersUseCase";
import { FindUserByIdUseCase } from "@application/usecases/user/FindUserByIdUseCase";
import { UpdateUserUseCase } from "@application/usecases/user/UpdateUserUseCase";
import { DeleteUserUseCase } from "@application/usecases/user/DeleteUserUseCase";
import { UserSerializer } from "@interfaces/serializers/user/UserSerializer";
import { UserController } from "@interfaces/controllers/user/UserController";

export function userDependencies(transactionManager: TransactionManager, userRepository: DatabaseUserRepository) {
    const createUserUseCase = new CreateUserUseCase(userRepository, transactionManager);
    const findUsersUseCase = new FindUsersUseCase(userRepository);
    const findUserByIdUseCase = new FindUserByIdUseCase(userRepository);
    const updateUserUseCase = new UpdateUserUseCase(userRepository, transactionManager);
    const deleteUserUseCase = new DeleteUserUseCase(userRepository, transactionManager);
    const userSerializer = new UserSerializer();
    return new UserController(createUserUseCase, findUsersUseCase, findUserByIdUseCase, updateUserUseCase, deleteUserUseCase, userSerializer);
}