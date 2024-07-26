import { Material } from '@domain/entities/material/Material';
import { MaterialRepository } from '@domain/repositories/material/MaterialRepository';
import { FindMaterialsUseCase, PaginationOptions, PaginatedResult } from '@application/usecases/material/FindMaterialsUseCase';
import { logger } from '@utils/logger';

jest.useFakeTimers();
jest.mock('@utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

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
      count: jest.fn(),
    } as jest.Mocked<MaterialRepository>;

    findMaterialsUseCase = new FindMaterialsUseCase(mockMaterialRepository);

    (logger.info as jest.Mock).mockClear();
    (logger.error as jest.Mock).mockClear();
  });

  it('should find materials successfully with pagination', async () => {
    const paginationOptions: PaginationOptions = { page: 1, limit: 10 };
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

    const paginatedResult: PaginatedResult<Material> = {
      data: materials,
      total: 2,
      page: 1,
      limit: 10,
      totalPages: 1,
    };

    mockMaterialRepository.findAll.mockResolvedValue(paginatedResult);

    const result = await findMaterialsUseCase.execute(paginationOptions);

    expect(mockMaterialRepository.findAll).toHaveBeenCalledWith(paginationOptions);
    expect(result).toEqual(paginatedResult);
    expect(logger.info).toHaveBeenCalledWith('Materials found. Page 1 of 1');
  });

  it('should return an empty array when no materials are found', async () => {
    const paginationOptions: PaginationOptions = { page: 1, limit: 10 };
    const emptyPaginatedResult: PaginatedResult<Material> = {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0,
    };

    mockMaterialRepository.findAll.mockResolvedValue(emptyPaginatedResult);

    const result = await findMaterialsUseCase.execute(paginationOptions);

    expect(mockMaterialRepository.findAll).toHaveBeenCalledWith(paginationOptions);
    expect(result).toEqual(emptyPaginatedResult);
    expect(logger.info).toHaveBeenCalledWith('Materials found. Page 1 of 0');
  });

  it('should throw an error when repository throws an error', async () => {
    const paginationOptions: PaginationOptions = { page: 1, limit: 10 };
    const error = new Error('Database error');
    mockMaterialRepository.findAll.mockRejectedValue(error);

    await expect(findMaterialsUseCase.execute(paginationOptions)).rejects.toThrow('Failed to find materials');
    expect(logger.error).toHaveBeenCalledWith('Failed to find materials', error);
  });
});
