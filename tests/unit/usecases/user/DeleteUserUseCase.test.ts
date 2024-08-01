import { DeleteUserUseCase } from '@domain/usecases/user/DeleteUserUseCase';
import { User } from '@domain/entities/user/User';
import { UserRepository } from '@domain/repositories/UserRepository';
import { TransactionManager } from '@infrastructure/database/TransactionManager';
import { DatabaseError, NotFoundError } from '@utils/errors';
import { Transaction } from '@infrastructure/database/Transaction';

jest.mock('@domain/repositories/user/UserRepository');
jest.mock('@infrastructure/database/TransactionManager');

describe('DeleteUserUseCase', () => {
  let deleteUserUseCase: DeleteUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockTransactionManager: jest.Mocked<TransactionManager>;
  let mockTransaction: jest.Mocked<Transaction>;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    mockTransaction = {} as unknown as jest.Mocked<Transaction>;

    mockTransactionManager = {
      runInTransaction: jest.fn(),
    } as unknown as jest.Mocked<TransactionManager>;

    deleteUserUseCase = new DeleteUserUseCase(mockUserRepository, mockTransactionManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should deleted a user successfully', async () => {
    const userId = 1;
    const user = new User(userId, 'test', 'name', 'lname', '123', 'd', new Date(), null, null, 'admin');
    const deletedUser = new User(userId, 'test', 'name', 'lname', '123', 'd', new Date(), null, new Date(), 'admin');

    mockUserRepository.findById.mockResolvedValue(user);
    mockTransactionManager.runInTransaction.mockImplementation(async (callback) => {
      return callback(mockTransaction);
    });
    mockUserRepository.delete.mockResolvedValue(deletedUser);

    const result = await deleteUserUseCase.execute(userId);

    expect(result).toEqual(deletedUser);
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockTransactionManager.runInTransaction).toHaveBeenCalled();
    expect(mockUserRepository.delete).toHaveBeenCalledWith(expect.objectContaining({ id: userId }), mockTransaction);
  });

  it('should throw NotFoundError when user does not exist', async () => {
    const userId = 1;
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(deleteUserUseCase.execute(userId)).rejects.toThrow(NotFoundError);
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
  });

  it('should throw DatabaseError when deletion fails', async () => {
    const userId = 1;
    const user = new User(userId, 'test', 'name', 'lname', '123', 'd', new Date(), null, null, 'admin');

    mockUserRepository.findById.mockResolvedValue(user);
    mockTransactionManager.runInTransaction.mockRejectedValue(new Error('DB eWrror'));

    await expect(deleteUserUseCase.execute(userId)).rejects.toThrow(DatabaseError);
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockTransactionManager.runInTransaction).toHaveBeenCalled();
  });

  it('should throw DatabaseError when UserRepository.delete fails', async () => {
    const userId = 1;
    const user = new User(userId, 'test', 'name', 'lname', '123', 'd', new Date(), null, null, 'admin');

    mockUserRepository.findById.mockResolvedValue(user);
    mockTransactionManager.runInTransaction.mockImplementation(async (callback) => {
      return callback(mockTransaction);
    });
    mockUserRepository.delete.mockRejectedValue(new Error('Repository error'));

    await expect(deleteUserUseCase.execute(userId)).rejects.toThrow(DatabaseError);
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockTransactionManager.runInTransaction).toHaveBeenCalled();
    expect(mockUserRepository.delete).toHaveBeenCalled();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
