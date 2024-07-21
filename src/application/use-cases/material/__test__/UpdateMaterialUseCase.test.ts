import { Material } from '@domain/entities/material/Material';
import { MaterialRepository } from '@domain/repositories/material/MaterialRepository';
import { TransactionManager } from '@infrastructure/database/TransactionManager';
import { UpdateMaterialDto } from '@application/dtos/material/UpdateMaterialDto';
import { UpdateMaterialUseCase } from '../UpdateMaterialUseCase';
import { validate } from 'class-validator';

jest.mock('class-validator');
jest.mock('@utils/logger');

describe('UpdateMaterialUseCase', () => {
  let updateMaterialUseCase: UpdateMaterialUseCase;
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

    updateMaterialUseCase = new UpdateMaterialUseCase(mockMaterialRepository, mockTransactionManager);
    (validate as jest.Mock).mockResolvedValue([]);
  });

  it('should update an existing material', async () => {
    const dto: UpdateMaterialDto = {
      id: 1,
      name: 'Updated Material',
      description: 'Updated Description',
      quantity: 20,
      unit: 'kg',
      createdAt: new Date('2022-02-25'),
    };

    const updatedMaterial = new Material(dto.id, dto.name, dto.description!, dto.quantity, dto.unit, dto.createdAt, new Date(), null);
    mockMaterialRepository.update.mockResolvedValue(updatedMaterial);

    const result = await updateMaterialUseCase.execute(dto);

    expect(mockMaterialRepository.update).toHaveBeenCalledWith(
      expect.objectContaining({
        id: dto.id,
        name: dto.name,
        description: dto.description,
        quantity: dto.quantity,
        unit: dto.unit,
        createdAt: dto.createdAt,
        updatedAt: expect.any(Date),
        deletedAt: null,
      }),
      expect.anything(),
    );
    expect(mockTransactionManager.runInTransaction).toHaveBeenCalled();
    expect(result).toEqual(updatedMaterial);
  });

  it('should throw an error if validation fails', async () => {
    const invalidDto: UpdateMaterialDto = {
      id: 1,
      name: '', // Invalid: empty name
      description: '',
      quantity: -5, // Invalid: negative quantity
      unit: 'pcs',
      createdAt: new Date('2022-02-25'),
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

    await expect(updateMaterialUseCase.execute(invalidDto)).rejects.toThrow('Failed to updated material');
  });

  it('should throw an error if update fails', async () => {
    const dto: UpdateMaterialDto = {
      id: 1,
      name: 'Updated Material',
      description: 'Updated Description',
      quantity: 20,
      unit: 'kg',
      createdAt: new Date('2022-02-25'),
    };

    mockMaterialRepository.update.mockRejectedValue(new Error('Failed to updated material'));

    await expect(updateMaterialUseCase.execute(dto)).rejects.toThrow('Failed to updated material');
  });
});
