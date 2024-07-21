import { CreateMaterialUseCase } from '@application/use-cases/material/CreateMaterialUseCase';
import { MaterialRepository } from '@domain/repositories/material/MaterialRepository';
import { TransactionManager } from '@infrastructure/database/TransactionManager';
import { CreateMaterialDto } from '@application/dtos/material/CreateMaterialDto';
import { Material } from '@domain/entities/material/Material';
import { validate } from 'class-validator';
import { logger } from '@utils/logger';

jest.useFakeTimers();
jest.mock('class-validator');
jest.mock('@utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    // เพิ่ม methods อื่นๆ ตามที่ใช้
  },
}));

describe('CreateMaterialUseCase', () => {
  let createMaterialUseCase: CreateMaterialUseCase;
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

    createMaterialUseCase = new CreateMaterialUseCase(mockMaterialRepository, mockTransactionManager);

    (validate as jest.Mock).mockResolvedValue([]);
    (logger.error as jest.Mock).mockClear();
    (logger.info as jest.Mock).mockClear();
  });

  it('should create a new material successfully', async () => {
    const dto: CreateMaterialDto = {
      name: 'Test Material',
      description: 'Test Description',
      quantity: 10,
      unit: 'pcs',
    };

    const createdMaterial = new Material(1, dto.name, dto.description!, dto.quantity, dto.unit, new Date(), new Date(), null);
    mockMaterialRepository.create.mockResolvedValue(createdMaterial);

    const result = await createMaterialUseCase.execute(dto);

    expect(mockMaterialRepository.create).toHaveBeenCalledWith(expect.any(Material), expect.anything());
    expect(result).toEqual(createdMaterial);
    expect(logger.info).toHaveBeenCalledWith({ materialId: createdMaterial.id }, 'Material created successfully');
  });

  it('should throw an error when validation fails', async () => {
    const dto: CreateMaterialDto = {
      name: '',
      description: 'Test Description',
      quantity: -1,
      unit: 'pcs',
    };

    (validate as jest.Mock).mockResolvedValue([{ constraints: { isNotEmpty: 'name should not be empty' } }]);

    await expect(createMaterialUseCase.execute(dto)).rejects.toThrow('Validation failed: name should not be empty');
    expect(logger.error).toHaveBeenCalledWith({ materialData: dto }, 'Validation failed: name should not be empty');
  });
});
