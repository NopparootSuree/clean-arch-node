import { CreateMaterialUseCase } from '@application/usecases/material/CreateMaterialUseCase';
import { Material } from '@domain/entities/material/Material';
import { MaterialRepository } from '@domain/repositories/material/MaterialRepository';
import { TransactionManager } from '@infrastructure/database/TransactionManager';
import { CreateMaterialDto } from '@application/dtos/material/CreateMaterialDto';
import { DatabaseError } from '@utils/errors';
import { Transaction } from '@infrastructure/database/Transaction';

// Mock dependencies
jest.mock('@domain/repositories/material/MaterialRepository');
jest.mock('@infrastructure/database/TransactionManager');

describe('CreateMaterialUseCase', () => {
  let createMaterialUseCase: CreateMaterialUseCase;
  let mockMaterialRepository: jest.Mocked<MaterialRepository>;
  let mockTransactionManager: jest.Mocked<TransactionManager>;
  let mockTransaction: jest.Mocked<Transaction>;

  beforeEach(() => {
    mockMaterialRepository = {
      create: jest.fn(),
    } as unknown as jest.Mocked<MaterialRepository>;

    mockTransaction = {} as unknown as jest.Mocked<Transaction>;

    mockTransactionManager = {
      runInTransaction: jest.fn(),
    } as unknown as jest.Mocked<TransactionManager>;

    createMaterialUseCase = new CreateMaterialUseCase(mockMaterialRepository, mockTransactionManager);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create a material successfully', async () => {
    const materialDto: CreateMaterialDto = {
      name: 'Test Material',
      description: 'Test Description',
      quantity: 10,
      unit: 'pcs',
    };

    const createdMaterial = new Material(1, materialDto.name, materialDto.description || null, materialDto.quantity, materialDto.unit, new Date(), null, null);

    mockTransactionManager.runInTransaction.mockImplementation(async (callback) => {
      return callback(mockTransaction);
    });

    mockMaterialRepository.create.mockResolvedValue(createdMaterial);

    const result = await createMaterialUseCase.execute(materialDto);

    expect(result).toEqual(createdMaterial);
    expect(mockTransactionManager.runInTransaction).toHaveBeenCalled();
    expect(mockMaterialRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: materialDto.name,
        description: materialDto.description,
        quantity: materialDto.quantity,
        unit: materialDto.unit,
      }),
      mockTransaction,
    );
  });

  it('should create a material with null description', async () => {
    const materialDto: CreateMaterialDto = {
      name: 'Test Material',
      quantity: 10,
      unit: 'pcs',
    };

    const createdMaterial = new Material(1, materialDto.name, null, materialDto.quantity, materialDto.unit, new Date(), null, null);

    mockTransactionManager.runInTransaction.mockImplementation(async (callback) => {
      return callback(mockTransaction);
    });

    mockMaterialRepository.create.mockResolvedValue(createdMaterial);

    const result = await createMaterialUseCase.execute(materialDto);

    expect(result).toEqual(createdMaterial);
    expect(result.description).toBeNull();
    expect(mockMaterialRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        name: materialDto.name,
        description: null,
        quantity: materialDto.quantity,
        unit: materialDto.unit,
      }),
      mockTransaction,
    );
  });

  it('should throw DatabaseError when creation fails', async () => {
    const materialDto: CreateMaterialDto = {
      name: 'Test Material',
      description: 'Test Description',
      quantity: 10,
      unit: 'pcs',
    };

    mockTransactionManager.runInTransaction.mockRejectedValue(new Error('DB error'));

    await expect(createMaterialUseCase.execute(materialDto)).rejects.toThrow(DatabaseError);
    expect(mockTransactionManager.runInTransaction).toHaveBeenCalled();
  });

  it('should throw an error when quantity is negative', async () => {
    const materialDto: CreateMaterialDto = {
      name: 'Test Material',
      quantity: -1,
      unit: 'pcs',
    };

    await expect(createMaterialUseCase.execute(materialDto)).rejects.toThrow();
  });

  it('should throw an error when name is empty', async () => {
    const materialDto: CreateMaterialDto = {
      name: '',
      quantity: 10,
      unit: 'pcs',
    };

    await expect(createMaterialUseCase.execute(materialDto)).rejects.toThrow();
  });

  it('should throw DatabaseError when MaterialRepository.create fails', async () => {
    const materialDto: CreateMaterialDto = {
      name: 'Test Material',
      quantity: 10,
      unit: 'pcs',
    };

    mockTransactionManager.runInTransaction.mockImplementation(async (callback) => {
      return callback(mockTransaction);
    });

    mockMaterialRepository.create.mockRejectedValue(new Error('Repository error'));

    await expect(createMaterialUseCase.execute(materialDto)).rejects.toThrow(DatabaseError);
    expect(mockMaterialRepository.create).toHaveBeenCalled();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
