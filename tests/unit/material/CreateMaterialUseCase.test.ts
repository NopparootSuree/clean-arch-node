import { CreateMaterialUseCase } from '@application/usecases/material/CreateMaterialUseCase';
import { MaterialRepository } from '@domain/repositories/material/MaterialRepository';
import { TransactionManager } from '@infrastructure/database/TransactionManager';
import { CreateMaterialDto } from '@application/dtos/material/CreateMaterialDto';
import { Material } from '@domain/entities/material/Material';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { logger } from '@utils/logger';

jest.mock('class-validator');
jest.mock('class-transformer');
jest.mock('@utils/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}));

describe('CreateMaterialUseCase', () => {
  let createMaterialUseCase: CreateMaterialUseCase;
  let mockMaterialRepository: jest.Mocked<MaterialRepository>;
  let mockTransactionManager: jest.Mocked<TransactionManager>;

  beforeEach(() => {
    mockMaterialRepository = {
      create: jest.fn(),
    } as unknown as jest.Mocked<MaterialRepository>;

    mockTransactionManager = {
      runInTransaction: jest.fn().mockImplementation((callback) => callback({})),
    } as unknown as jest.Mocked<TransactionManager>;

    createMaterialUseCase = new CreateMaterialUseCase(mockMaterialRepository, mockTransactionManager);

    (validate as jest.Mock).mockResolvedValue([]);
    (plainToClass as jest.Mock).mockImplementation((_, obj) => obj);
    (logger.info as jest.Mock).mockClear();
    (logger.warn as jest.Mock).mockClear();
    (logger.error as jest.Mock).mockClear();
  });

  it('should create a new material successfully', async () => {
    const dto: CreateMaterialDto = {
      name: 'Test Material',
      description: 'Test Description',
      quantity: 10,
      unit: 'pcs',
    };

    const createdMaterial = new Material(1, dto.name, dto.description!, dto.quantity, dto.unit, expect.any(Date), expect.any(Date), null);
    mockMaterialRepository.create.mockResolvedValue(createdMaterial);

    const result = await createMaterialUseCase.execute(dto);

    expect(mockMaterialRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 0,
        name: dto.name,
        description: dto.description,
        quantity: dto.quantity,
        unit: dto.unit,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        deletedAt: null,
      }),
      expect.anything(),
    );
    expect(mockTransactionManager.runInTransaction).toHaveBeenCalled();
    expect(result).toEqual(createdMaterial);
    expect(logger.info).toHaveBeenCalledWith(`Material created successfully id = ${createdMaterial.id}`);
  });

  it('should throw an error when validation fails', async () => {
    const dto: CreateMaterialDto = {
      name: '',
      description: 'Test Description',
      quantity: -1,
      unit: 'pcs',
    };

    (validate as jest.Mock).mockResolvedValue([{ constraints: { isNotEmpty: 'name should not be empty' } }]);

    await expect(createMaterialUseCase.execute(dto)).rejects.toThrow('Validation failed');
    expect(logger.warn).toHaveBeenCalledWith('Validation failed');
  });

  it('should throw an error when creation fails', async () => {
    const dto: CreateMaterialDto = {
      name: 'Test Material',
      description: 'Test Description',
      quantity: 10,
      unit: 'pcs',
    };

    mockMaterialRepository.create.mockRejectedValue(new Error('Database error'));

    await expect(createMaterialUseCase.execute(dto)).rejects.toThrow('Failed to create material');
    expect(logger.error).toHaveBeenCalledWith('Failed to create material');
  });
});
