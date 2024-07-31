import { DeleteMaterialUseCase } from '@application/usecases/material/DeleteMaterialUseCase';
import { Material } from '@domain/entities/material/Material';
import { MaterialRepository } from '@domain/repositories/material/MaterialRepository';
import { TransactionManager } from '@infrastructure/database/TransactionManager';
import { DatabaseError, NotFoundError } from '@utils/errors';
import { Transaction } from '@infrastructure/database/Transaction';

// Mock dependencies
jest.mock('@domain/repositories/material/MaterialRepository');
jest.mock('@infrastructure/database/TransactionManager');

describe('DeleteMaterialUseCase', () => {
  let deleteMaterialUseCase: DeleteMaterialUseCase;
  let mockMaterialRepository: jest.Mocked<MaterialRepository>;
  let mockTransactionManager: jest.Mocked<TransactionManager>;
  let mockTransaction: jest.Mocked<Transaction>;

  beforeEach(() => {
    mockMaterialRepository = {
      findById: jest.fn(),
      delete: jest.fn(),
    } as unknown as jest.Mocked<MaterialRepository>;

    mockTransaction = {} as unknown as jest.Mocked<Transaction>;

    mockTransactionManager = {
      runInTransaction: jest.fn(),
    } as unknown as jest.Mocked<TransactionManager>;

    deleteMaterialUseCase = new DeleteMaterialUseCase(mockMaterialRepository, mockTransactionManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should deleted a material successfully', async () => {
    const materialId = 1;
    const material = new Material(materialId, 'Test Material', 'Description', 10, 'pcs', new Date(), new Date(), null);
    const deletedMaterial = new Material(materialId, 'Test Material', 'Description', 10, 'pcs', new Date(), new Date(), new Date());

    mockMaterialRepository.findById.mockResolvedValue(material);
    mockTransactionManager.runInTransaction.mockImplementation(async (callback) => {
      return callback(mockTransaction);
    });
    mockMaterialRepository.delete.mockResolvedValue(deletedMaterial);

    const result = await deleteMaterialUseCase.execute(materialId);

    expect(result).toEqual(deletedMaterial);
    expect(mockMaterialRepository.findById).toHaveBeenCalledWith(materialId);
    expect(mockTransactionManager.runInTransaction).toHaveBeenCalled();
    expect(mockMaterialRepository.delete).toHaveBeenCalledWith(expect.objectContaining({ id: materialId }), mockTransaction);
  });

  it('should throw NotFoundError when material does not exist', async () => {
    const materialId = 1;
    mockMaterialRepository.findById.mockResolvedValue(null);

    await expect(deleteMaterialUseCase.execute(materialId)).rejects.toThrow(NotFoundError);
    expect(mockMaterialRepository.findById).toHaveBeenCalledWith(materialId);
  });

  it('should throw DatabaseError when deletion fails', async () => {
    const materialId = 1;
    const material = new Material(materialId, 'Test Material', 'Description', 10, 'pcs', new Date(), new Date(), null);

    mockMaterialRepository.findById.mockResolvedValue(material);
    mockTransactionManager.runInTransaction.mockRejectedValue(new Error('DB error'));

    await expect(deleteMaterialUseCase.execute(materialId)).rejects.toThrow(DatabaseError);
    expect(mockMaterialRepository.findById).toHaveBeenCalledWith(materialId);
    expect(mockTransactionManager.runInTransaction).toHaveBeenCalled();
  });

  it('should throw DatabaseError when MaterialRepository.delete fails', async () => {
    const materialId = 1;
    const material = new Material(materialId, 'Test Material', 'Description', 10, 'pcs', new Date(), new Date(), null);

    mockMaterialRepository.findById.mockResolvedValue(material);
    mockTransactionManager.runInTransaction.mockImplementation(async (callback) => {
      return callback(mockTransaction);
    });
    mockMaterialRepository.delete.mockRejectedValue(new Error('Repository error'));

    await expect(deleteMaterialUseCase.execute(materialId)).rejects.toThrow(DatabaseError);
    expect(mockMaterialRepository.findById).toHaveBeenCalledWith(materialId);
    expect(mockTransactionManager.runInTransaction).toHaveBeenCalled();
    expect(mockMaterialRepository.delete).toHaveBeenCalled();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
