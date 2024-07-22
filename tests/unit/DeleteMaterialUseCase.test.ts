import { Material } from '@domain/entities/material/Material';
import { MaterialRepository } from '@domain/repositories/material/MaterialRepository';
import { TransactionManager } from '@infrastructure/database/TransactionManager';
import { DeleteMaterialUseCase } from '@application/use-cases/material/DeleteMaterialUseCase';

jest.useFakeTimers();
jest.mock('class-validator');
jest.mock('@utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('DeleteMaterialUseCase', () => {
  let deleteMaterialUseCase: DeleteMaterialUseCase;
  let mockMaterialRepository: jest.Mocked<MaterialRepository>;
  let mockTransactionManager: jest.Mocked<TransactionManager>;

  beforeEach(() => {
    mockMaterialRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    } as jest.Mocked<MaterialRepository>;

    mockTransactionManager = {
      runInTransaction: jest.fn().mockImplementation((callback) => callback({})),
    } as unknown as jest.Mocked<TransactionManager>;

    deleteMaterialUseCase = new DeleteMaterialUseCase(mockMaterialRepository, mockTransactionManager);
  });

  it('should delete an existing material', async () => {
    const deletedMaterial: Material = {
      id: 1,
      name: 'deleted Material',
      description: 'deleted Description',
      quantity: 20,
      unit: 'kg',
      createdAt: new Date('2022-02-25'),
      updatedAt: null,
      deletedAt: null,
    };

    mockMaterialRepository.delete.mockResolvedValue(deletedMaterial);

    const result = await deleteMaterialUseCase.execute(deletedMaterial);

    expect(mockMaterialRepository.delete).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        name: 'deleted Material',
        description: 'deleted Description',
        quantity: 20,
        unit: 'kg',
        createdAt: new Date('2022-02-25'),
        updatedAt: null,
        deletedAt: expect.any(Date),
      }),
      expect.anything(),
    );
    expect(mockTransactionManager.runInTransaction).toHaveBeenCalled();
    expect(result).toEqual(deletedMaterial);
  });

  it('should throw an error if update fails', async () => {
    const dto: Material = {
      id: 1,
      name: 'deleted Material',
      description: 'deleted Description',
      quantity: 20,
      unit: 'kg',
      createdAt: new Date('2022-02-25'),
      updatedAt: null,
      deletedAt: expect.any(Date),
    };

    mockMaterialRepository.delete.mockRejectedValue(new Error('Failed to delete material'));

    await expect(deleteMaterialUseCase.execute(dto)).rejects.toThrow('Failed to delete material');
  });
});
