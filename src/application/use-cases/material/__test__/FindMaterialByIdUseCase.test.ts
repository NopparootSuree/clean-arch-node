import { Material } from '@domain/entities/material/Material';
import { MaterialRepository } from '@domain/repositories/material/MaterialRepository';
import { FindMaterialByIdUseCase } from '../FindMaterialByIdUseCase';
import { logger } from '@utils/logger';

jest.mock('@utils/logger');

describe('FindMaterialByIdUseCase', () => {
  let findMaterialByIdUseCase: FindMaterialByIdUseCase;
  let mockMaterialRepository: jest.Mocked<MaterialRepository>;

  beforeEach(() => {
    mockMaterialRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    } as jest.Mocked<MaterialRepository>;

    findMaterialByIdUseCase = new FindMaterialByIdUseCase(mockMaterialRepository);

    (logger.info as jest.Mock).mockClear();
    (logger.error as jest.Mock).mockClear();
  });

  it('should find an existing material by id', async () => {
    const materialId = 1;
    const material: Material = {
      id: materialId,
      name: 'Material',
      description: 'Description',
      quantity: 20,
      unit: 'kg',
      createdAt: new Date('2022-02-25'),
      updatedAt: null,
      deletedAt: null,
    };

    mockMaterialRepository.findById.mockResolvedValue(material);

    const result = await findMaterialByIdUseCase.execute(materialId);

    expect(mockMaterialRepository.findById).toHaveBeenCalledWith(materialId);
    expect(result).toEqual(material);
    expect(logger.info).toHaveBeenCalledWith({ materialId }, 'Material was found');
  });

  it('should return null when material is not found', async () => {
    const materialId = 999;
    mockMaterialRepository.findById.mockResolvedValue(null);

    const result = await findMaterialByIdUseCase.execute(materialId);

    expect(mockMaterialRepository.findById).toHaveBeenCalledWith(materialId);
    expect(result).toBeNull();
    expect(logger.info).toHaveBeenCalledWith({ materialId }, 'Material was found');
  });

  it('should throw an error when repository throws an error', async () => {
    const materialId = 1;
    const error = new Error('Database error');
    mockMaterialRepository.findById.mockRejectedValue(error);

    await expect(findMaterialByIdUseCase.execute(materialId)).rejects.toThrow('Failed to find by id material');
    expect(logger.error).toHaveBeenCalledWith({ error: materialId }, 'Failed to find by id material');
  });
});
