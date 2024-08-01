import { User } from "@domain/entities/user/User";
import { UserRepository } from "@domain/repositories/UserRepository";
import { FindUserByIdUseCase } from "@domain/usecases/user/FindUserByIdUseCase";
import { DatabaseError, NotFoundError } from "@utils/errors";

jest.mock('@domain/repositories/UserRepository');

describe('FindUserByIdUseCase', () => {
    let findUserByIdUseCase: FindUserByIdUseCase;
    let mockUserRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        mockUserRepository = {
            findById: jest.fn(),
        } as unknown as jest.Mocked<UserRepository>

        findUserByIdUseCase = new FindUserByIdUseCase(mockUserRepository);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should find an existing user by id', async () => {
        const userId = 1;
        
        const user: User = {
            id: 1,
            username: 'User',
            firstName: 'asd',
            lastName: 'vfg',
            phone: '02564565',
            department: 'cv',
            createdAt: new Date('2024-07-27'),
            updatedAt: null,
            deletedAt: null,
            role: 'admin'
        };

        mockUserRepository.findById.mockResolvedValue(user);

        const result = await findUserByIdUseCase.execute(userId);

        expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
        expect(result).toEqual(user);
    });

    it('should throw and error when user is not found', async () => {
        const userId = 1;
        mockUserRepository.findById.mockResolvedValue(null);

        await expect(findUserByIdUseCase.execute(userId)).rejects.toThrow(NotFoundError);
        expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    })

    it('should throw DatabaseError when repository throws an error', async () => {
        const userId = 1;
        mockUserRepository.findById.mockRejectedValue(new Error('Database error'));
    
        await expect(findUserByIdUseCase.execute(userId)).rejects.toThrow(DatabaseError);
        expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      });
    
      it('should handle and rethrow other unexpected errors as DatabaseError', async () => {
        const userId = 1;
        const unexpectedError = new Error('Unexpected error');
        mockUserRepository.findById.mockRejectedValue(unexpectedError);
    
        await expect(findUserByIdUseCase.execute(userId)).rejects.toThrow(DatabaseError);
        expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      });
    
      afterAll(() => {
        jest.restoreAllMocks();
      });
})