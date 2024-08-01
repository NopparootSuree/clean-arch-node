import { User } from '@domain/entities/user/User';
import { UserRepository } from '@domain/repositories/UserRepository';
import { TransactionManager } from '@infrastructure/database/TransactionManager';
import { UpdateUserUseCase } from '@domain/usecases/user/UpdateUserUseCase';
import { UpdateUserDto } from '@interfaces/dtos/user/UpdateUserDto';
import { NotFoundError, DatabaseError } from '@utils/errors';

jest.mock('@domain/repositories/UserRepository');
jest.mock('@infrastructure/database/TransactionManager');

describe('UpdateUserUseCase', () => {
  let updateUserUseCase: UpdateUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockTransactionManager: jest.Mocked<TransactionManager>;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    mockTransactionManager = {
      runInTransaction: jest.fn().mockImplementation((callback) => callback({})),
    } as unknown as jest.Mocked<TransactionManager>;

    updateUserUseCase = new UpdateUserUseCase(mockUserRepository, mockTransactionManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update an existing user successfully', async () => {
    const userId = 1;

    const dto: UpdateUserDto = {
      firstName: 'asd',
      lastName: 'vfg',
      phone: '02564565',
      department: 'cv',
      role: 'admin',
    };

    const existingUser = new User(userId, 'test', 'as', 'cc', '12313', 'xc', new Date('2024-07-31'), null, null, 'admin');
    mockUserRepository.findById.mockResolvedValue(existingUser);

    const updatedUser = new User(userId, 'test', dto.firstName!, dto.lastName, dto.phone, dto.department!, existingUser.createdAt, new Date(), null, dto.role);
    mockUserRepository.update.mockResolvedValue(updatedUser);

    const result = await updateUserUseCase.execute(userId, dto);

    expect(result).toEqual(updatedUser);
    expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    expect(mockUserRepository.update).toHaveBeenCalledWith(expect.any(User), expect.anything());
    expect(mockTransactionManager.runInTransaction).toHaveBeenCalled();
  });

  it('should throw NotFoundError if material is not found', async () => {
    const id = 1;
    const dto: UpdateUserDto = {
      firstName: 'asd',
      lastName: 'vfg',
      phone: '02564565',
      department: 'cv',
      role: 'admin',
    };

    mockUserRepository.findById.mockResolvedValue(null);

    await expect(updateUserUseCase.execute(id, dto)).rejects.toThrow(NotFoundError);
  });

  it('should throw DatabaseError if update fails', async () => {
    const userId = 1;
    const dto: UpdateUserDto = {
      firstName: 'asd',
      lastName: 'vfg',
      phone: '02564565',
      department: 'cv',
      role: 'admin',
    };

    const existingUser = new User(userId, 'test', 'as', 'cc', '12313', 'xc', new Date('2024-07-31'), null, null, 'admin');
    mockUserRepository.findById.mockResolvedValue(existingUser);
    mockUserRepository.update.mockRejectedValue(new Error('Database error'));

    await expect(updateUserUseCase.execute(userId, dto)).rejects.toThrow(DatabaseError);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
