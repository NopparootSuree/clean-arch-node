// import { User } from '@domain/entities/user/User';
// import { UserRepository } from '@domain/repositories/user/UserRepository';
// import { TransactionManager } from '@infrastructure/database/TransactionManager';
// import { UpdateUserUseCase } from '@application/usecases/user/UpdateUserUseCase';
// import { UpdateUserDto } from '@application/dtos/user/UpdateUserDto';
// import { NotFoundError, DatabaseError } from '@utils/errors';

// jest.mock('@domain/repositories/user/UserRepository');
// jest.mock('@infrastructure/database/TransactionManager');

// describe('UpdateUserUseCase', () => {
//   let updateUserUseCase: UpdateUserUseCase;
//   let mockUserRepository: jest.Mocked<UserRepository>;
//   let mockTransactionManager: jest.Mocked<TransactionManager>;

//   beforeEach(() => {
//     mockUserRepository = {
//       findById: jest.fn(),
//       update: jest.fn(),
//     } as unknown as jest.Mocked<UserRepository>;

//     mockTransactionManager = {
//       runInTransaction: jest.fn().mockImplementation((callback) => callback({})),
//     } as unknown as jest.Mocked<TransactionManager>;

//     updateUserUseCase = new UpdateUserUseCase(mockUserRepository, mockTransactionManager);
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   it('should update an existing user successfully', async () => {
//     const materialId = 1;
//     const dto: UpdateUserDto = {
//       name: 'Updated Material',
//       description: 'Updated Description',
//       quantity: 20,
//       unit: 'kg',
//     };

//     const existingMaterial = new Material(materialId, 'Old Material', 'Old Description', 10, 'pcs', new Date('2022-02-25'), null, null);
//     mockMaterialRepository.findById.mockResolvedValue(existingMaterial);

//     const updatedMaterial = new Material(materialId, dto.name, dto.description!, dto.quantity, dto.unit, existingMaterial.createdAt, new Date(), null);
//     mockMaterialRepository.update.mockResolvedValue(updatedMaterial);

//     const result = await updateMaterialUseCase.execute(materialId, dto);

//     expect(result).toEqual(updatedMaterial);
//     expect(mockMaterialRepository.findById).toHaveBeenCalledWith(materialId);
//     expect(mockMaterialRepository.update).toHaveBeenCalledWith(expect.any(Material), expect.anything());
//     expect(mockTransactionManager.runInTransaction).toHaveBeenCalled();
//   });

//   it('should throw NotFoundError if material is not found', async () => {
//     const id = 1;
//     const dto: UpdateMaterialDto = {
//       name: 'Updated Material',
//       description: 'Updated Description',
//       quantity: 20,
//       unit: 'kg',
//     };

//     mockMaterialRepository.findById.mockResolvedValue(null);

//     await expect(updateMaterialUseCase.execute(id, dto)).rejects.toThrow(NotFoundError);
//   });

//   it('should throw DatabaseError if update fails', async () => {
//     const id = 1;
//     const dto: UpdateMaterialDto = {
//       name: 'Updated Material',
//       description: 'Updated Description',
//       quantity: 20,
//       unit: 'kg',
//     };

//     const existingMaterial = new Material(id, 'Old Material', 'Old Description', 10, 'pcs', new Date('2022-02-25'), null, null);
//     mockMaterialRepository.findById.mockResolvedValue(existingMaterial);
//     mockMaterialRepository.update.mockRejectedValue(new Error('Database error'));

//     await expect(updateMaterialUseCase.execute(id, dto)).rejects.toThrow(DatabaseError);
//   });

//   afterAll(() => {
//     jest.restoreAllMocks();
//   });
// });
