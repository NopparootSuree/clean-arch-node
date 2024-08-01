import { CreateUserUseCase } from '@domain/usecases/user/CreateUserUseCase';
import { User } from '@domain/entities/user/User';
import { UserRepository } from '@domain/repositories/UserRepository';
import { TransactionManager } from '@infrastructure/database/TransactionManager';
import { CreateUserDto } from '@interfaces/dtos/user/CreateUserDto';
import { DatabaseError } from '@utils/errors';
import { Transaction } from '@infrastructure/database/Transaction';

// Mock dependencies
jest.mock('@domain/repositories/UserRepository');
jest.mock('@infrastructure/database/TransactionManager');

describe('CreateUserUseCase', () => {
  let createUserUseCase: CreateUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockTransactionManager: jest.Mocked<TransactionManager>;
  let mockTransaction: jest.Mocked<Transaction>;

  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    mockTransaction = {} as unknown as jest.Mocked<Transaction>;

    mockTransactionManager = {
      runInTransaction: jest.fn(),
    } as unknown as jest.Mocked<TransactionManager>;

    createUserUseCase = new CreateUserUseCase(mockUserRepository, mockTransactionManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a user successfully', async () => {
    const userDto: CreateUserDto = {
      username: 'asdasd',
      firstName: 'firstname',
      lastName: 'lastname',
      phone: '0987654321',
      department: 'IPC',
      role: 'admin',
    };

    const createUser = new User(1, userDto.username, userDto.firstName, userDto.lastName, userDto.phone!, userDto.department!, new Date(), null, null, userDto.role);

    mockTransactionManager.runInTransaction.mockImplementation(async (callback) => {
      return callback(mockTransaction);
    });

    mockUserRepository.create.mockResolvedValue(createUser)

    const result = await createUserUseCase.execute(userDto);

    expect(result).toEqual(createUser);
    expect(mockTransactionManager.runInTransaction).toHaveBeenCalled();
    expect(mockUserRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        username: userDto.username,
        firstName: userDto.firstName,
        lastName: userDto.lastName,
        phone: userDto.phone,
        department: userDto.department,
        role: userDto.role,
      }),
      mockTransaction,
    );
  });

  it('should throw DatabaseError when creation fails', async () => {
    const userDto: CreateUserDto = {
      username: 'Test User',
      firstName: 'firstname',
      lastName: 'lastname',
      department: 'IPC',
      role: 'admin',
    };

    mockTransactionManager.runInTransaction.mockRejectedValue(new Error('DB error'));

    await expect(createUserUseCase.execute(userDto)).rejects.toThrow(DatabaseError);
    expect(mockTransactionManager.runInTransaction).toHaveBeenCalled();
  });

  it('should throw an error when usernae is empty', async () => {
    const userDto: CreateUserDto = {
      username: 'Test User',
      firstName: 'firstname',
      lastName: 'lastname',
      phone: '0987654321',
      department: 'IPC',
      role: 'admin',
    };

    await expect(createUserUseCase.execute(userDto)).rejects.toThrow();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
