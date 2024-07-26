import { Material } from '@domain/entities/material/Material';
import { MaterialRepository } from '@domain/repositories/material/MaterialRepository';
import { TransactionManager } from '@infrastructure/database/TransactionManager';
import { DeleteMaterialUseCase } from '@application/usecases/material/DeleteMaterialUseCase';
import { logger } from '@utils/logger';

jest.mock('@utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
  },
}));

describe('DeleteMaterialUseCase', () => {
  let deleteMaterialUseCase: DeleteMaterialUseCase;
  let mockMaterialRepository: jest.Mocked<MaterialRepository>;
  let mockTransactionManager: jest.Mocked<TransactionManager>;

  beforeEach(() => {
    mockMaterialRepository = {
      findById: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<MaterialRepository>;

    mockTransactionManager = {
      runInTransaction: jest.fn().mockImplementation((callback) => callback({})),
    } as unknown as jest.Mocked<TransactionManager>;

    deleteMaterialUseCase = new DeleteMaterialUseCase(mockMaterialRepository, mockTransactionManager);

    (logger.info as jest.Mock).mockClear();
    (logger.error as jest.Mock).mockClear();
    (logger.warn as jest.Mock).mockClear();
  });

  it('should delete an existing material', async () => {
    const materialId = 1;
    const material: Material = {
      id: materialId,
      name: 'Material to delete',
      description: 'Description',
      quantity: 20,
      unit: 'kg',
      createdAt: new Date('2022-02-25'),
      updatedAt: null,
      deletedAt: null,
    };

    const deletedMaterial = { ...material, deletedAt: new Date() };

    mockMaterialRepository.findById.mockResolvedValue(material);
    mockMaterialRepository.delete.mockResolvedValue(deletedMaterial);

    const result = await deleteMaterialUseCase.execute(materialId);

    expect(mockMaterialRepository.findById).toHaveBeenCalledWith(materialId);
    expect(mockMaterialRepository.delete).toHaveBeenCalledWith(
      expect.objectContaining({
        ...material,
        deletedAt: expect.any(Date),
      }),
      expect.anything(),
    );
    expect(mockTransactionManager.runInTransaction).toHaveBeenCalled();
    expect(result).toEqual(deletedMaterial);
    expect(logger.info).toHaveBeenCalledWith(`Material deleted successfully id = ${materialId}`);
  });

  it('should throw an error if material is not found', async () => {
    const materialId = 999;
    mockMaterialRepository.findById.mockResolvedValue(null);

    await expect(deleteMaterialUseCase.execute(materialId)).rejects.toThrow('Material not found');
    expect(logger.warn).toHaveBeenCalledWith('Material not found');
  });

  it('should throw an error if deletion fails', async () => {
    const materialId = 1;
    const material: Material = {
      id: materialId,
      name: 'Material to delete',
      description: 'Description',
      quantity: 20,
      unit: 'kg',
      createdAt: new Date('2022-02-25'),
      updatedAt: null,
      deletedAt: null,
    };

    mockMaterialRepository.findById.mockResolvedValue(material);
    mockMaterialRepository.delete.mockRejectedValue(new Error('Database error'));

    await expect(deleteMaterialUseCase.execute(materialId)).rejects.toThrow('Failed to delete material');
    expect(logger.error).toHaveBeenCalledWith('Failed to delete material');
  });
});
