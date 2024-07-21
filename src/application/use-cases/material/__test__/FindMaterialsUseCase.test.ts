import { Material } from '@domain/entities/material/Material';
import { MaterialRepository } from '@domain/repositories/material/MaterialRepository';
import { FindMaterialsUseCase } from '../FindMaterialsUseCase';
import { logger } from '@utils/logger';

jest.mock('@utils/logger');

describe('FindMaterialsUseCase', () => {
  let findMaterialsUseCase: FindMaterialsUseCase;
  let mockMaterialRepository: jest.Mocked<MaterialRepository>;

  beforeEach(() => {
    mockMaterialRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findAll: jest.fn(),
    } as jest.Mocked<MaterialRepository>;

    findMaterialsUseCase = new FindMaterialsUseCase(mockMaterialRepository);

    (logger.info as jest.Mock).mockClear();
    (logger.error as jest.Mock).mockClear();
  });

  it('should find all materials successfully', async () => {
    const materials: Material[] = [
      {
        id: 1,
        name: 'Material1',
        description: 'Description1',
        quantity: 20,
        unit: 'kg',
        createdAt: new Date('2022-02-25'),
        updatedAt: null,
        deletedAt: null,
      },
      {
        id: 2,
        name: 'Material2',
        description: 'Description2',
        quantity: 30,
        unit: 'l',
        createdAt: new Date('2022-02-26'),
        updatedAt: null,
        deletedAt: null,
      },
    ];

    mockMaterialRepository.findAll.mockResolvedValue(materials);

    const result = await findMaterialsUseCase.execute();

    expect(mockMaterialRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(materials);
    expect(logger.info).toHaveBeenCalledWith('Materials was found');
  });

  it('should return an empty array when no materials are found', async () => {
    const emptyMaterials: Material[] = [];
    mockMaterialRepository.findAll.mockResolvedValue(emptyMaterials);

    const result = await findMaterialsUseCase.execute();

    expect(mockMaterialRepository.findAll).toHaveBeenCalled();
    expect(result).toEqual(emptyMaterials);
    expect(logger.info).toHaveBeenCalledWith('Materials was found');
  });

  it('should throw an error when repository throws an error', async () => {
    const error = new Error('Database error');
    mockMaterialRepository.findAll.mockRejectedValue(error);

    await expect(findMaterialsUseCase.execute()).rejects.toThrow('Failed to find materials');
    expect(logger.error).toHaveBeenCalledWith({ error: error }, 'Failed to find materials');
  });
});
