import { Material } from '@domain/entities/material/Material';
import { MaterialRepository } from '@domain/repositories/material/MaterialRepository';
import { TransactionManager } from '@infrastructure/database/TransactionManager';
import { UpdateMaterialDto } from '@application/dtos/material/UpdateMaterialDto';
import { UpdateMaterialUseCase } from '@application/use-cases/material/UpdateMaterialUseCase';
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

describe('UpdateMaterialUseCase', () => {
  let updateMaterialUseCase: UpdateMaterialUseCase;
  let mockMaterialRepository: jest.Mocked<MaterialRepository>;
  let mockTransactionManager: jest.Mocked<TransactionManager>;

  beforeEach(() => {
    mockMaterialRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<MaterialRepository>;

    mockTransactionManager = {
      runInTransaction: jest.fn().mockImplementation((callback) => callback({})),
    } as unknown as jest.Mocked<TransactionManager>;

    updateMaterialUseCase = new UpdateMaterialUseCase(mockMaterialRepository, mockTransactionManager);
    (validate as jest.Mock).mockResolvedValue([]);
    (plainToClass as jest.Mock).mockImplementation((_, obj) => obj);
  });

  it('should update an existing material', async () => {
    const id = 1;
    const dto: UpdateMaterialDto = {
      name: 'Updated Material',
      description: 'Updated Description',
      quantity: 20,
      unit: 'kg',
    };

    const existingMaterial = new Material(id, 'Old Material', 'Old Description', 10, 'pcs', new Date('2022-02-25'), null, null);
    mockMaterialRepository.findById.mockResolvedValue(existingMaterial);

    const updatedMaterial = new Material(id, dto.name, dto.description!, dto.quantity, dto.unit, existingMaterial.createdAt, new Date(), null);
    mockMaterialRepository.update.mockResolvedValue(updatedMaterial);

    const result = await updateMaterialUseCase.execute(id, dto);

    expect(mockMaterialRepository.findById).toHaveBeenCalledWith(id);
    expect(mockMaterialRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id,
        name: dto.name,
        description: dto.description,
        quantity: dto.quantity,
        unit: dto.unit,
        createdAt: existingMaterial.createdAt,
        updatedAt: expect.any(Date),
        deletedAt: null,
      }),
      expect.anything(),
    );
    expect(mockTransactionManager.runInTransaction).toHaveBeenCalled();
    expect(result).toEqual(updatedMaterial);
    expect(logger.info).toHaveBeenCalledWith(`Material updated successfully id = ${id}`);
  });

  it('should throw an error if validation fails', async () => {
    const id = 1;
    const invalidDto: UpdateMaterialDto = {
      name: '', // Invalid: empty name
      description: '',
      quantity: -5, // Invalid: negative quantity
      unit: 'pcs',
    };

    (validate as jest.Mock).mockResolvedValue([
      {
        property: 'name',
        constraints: { isNotEmpty: 'name should not be empty' },
      },
      {
        property: 'quantity',
        constraints: { min: 'quantity must be a positive number' },
      },
    ]);

    await expect(updateMaterialUseCase.execute(id, invalidDto)).rejects.toThrow('Validation failed');
    expect(logger.warn).toHaveBeenCalledWith('Validation failed');
  });

  it('should throw an error if material is not found', async () => {
    const id = 1;
    const dto: UpdateMaterialDto = {
      name: 'Updated Material',
      description: 'Updated Description',
      quantity: 20,
      unit: 'kg',
    };

    mockMaterialRepository.findById.mockResolvedValue(null);

    await expect(updateMaterialUseCase.execute(id, dto)).rejects.toThrow('Material not found');
    expect(logger.warn).toHaveBeenCalledWith('Material not found');
  });

  it('should throw an error if update fails', async () => {
    const id = 1;
    const dto: UpdateMaterialDto = {
      name: 'Updated Material',
      description: 'Updated Description',
      quantity: 20,
      unit: 'kg',
    };

    const existingMaterial = new Material(id, 'Old Material', 'Old Description', 10, 'pcs', new Date('2022-02-25'), null, null);
    mockMaterialRepository.findById.mockResolvedValue(existingMaterial);
    mockMaterialRepository.update.mockRejectedValue(new Error('Database error'));

    await expect(updateMaterialUseCase.execute(id, dto)).rejects.toThrow('Failed to updated material');
    expect(logger.error).toHaveBeenCalledWith('Failed to updated material');
  });
});
