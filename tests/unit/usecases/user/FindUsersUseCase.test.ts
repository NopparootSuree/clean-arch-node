import { User } from '@domain/entities/user/User';
import { UserRepository } from '@domain/repositories/user/UserRepository';
import { FindUsersUseCase, PaginatedResult, PaginationOptions } from '@application/usecases/user/FindUsersUseCase';
import { DatabaseError, NotFoundError } from '@utils/errors';

jest.mock('@domain/repositories/user/UserRepository');

describe('FindUsersUseCase', () => {
  let findUsersUseCase: FindUsersUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      findAll: jest.fn(),
      count: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    findUsersUseCase = new FindUsersUseCase(mockUserRepository);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should find users successfully', async () => {
    const paginationOptions: PaginationOptions = { page: 1, limit: 10 };
    const users: User[] = [
      new User(1, 'User1', 'asd', 'vfg', '02564565', 'cv', new Date('2024-07-27'), null, null, 'user'),
      new User(2, 'User2', 'des', 'vfg', '02564565', 'sc', new Date('2022-02-26'), null, null, 'admin'),
    ];

    const paginatedResult: PaginatedResult<User> = {
      data: users,
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    };

    mockUserRepository.findAll.mockResolvedValue(paginatedResult);

    const result = await findUsersUseCase.execute(paginationOptions);

    expect(mockUserRepository.findAll).toHaveBeenCalledWith(paginationOptions);
    expect(result).toEqual(paginatedResult);
  });

  it('should return an empty array when no user are found', async () => {
    const paginationOptions: PaginationOptions = { page: 1, limit: 10 };
    const emptyPaginatedResult: PaginatedResult<User> = {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };

    mockUserRepository.findAll.mockResolvedValue(emptyPaginatedResult);

    await expect(findUsersUseCase.execute(paginationOptions)).rejects.toThrow(NotFoundError);
    expect(mockUserRepository.findAll).toHaveBeenCalledWith(paginationOptions);
  });

  it('should throw DatabaseError when repository throws an error', async () => {
    const paginationOptions: PaginationOptions = { page: 1, limit: 10 };
    const error = new Error('Database error');
    mockUserRepository.findAll.mockRejectedValue(error);

    await expect(findUsersUseCase.execute(paginationOptions)).rejects.toThrow(DatabaseError);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
