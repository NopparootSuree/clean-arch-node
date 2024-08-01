import { Material } from '@domain/entities/material/Material';
import { MaterialRepository } from '@domain/repositories/material/MaterialRepository';
import { FindMaterialsUseCase, PaginationOptions, PaginatedResult } from '@domain/usecases/material/FindMaterialsUseCase';
import { DatabaseError, NotFoundError } from '@utils/errors';

jest.mock('@domain/repositories/material/MaterialRepository');

describe('FindMaterialsUseCase', () => {
  let findMaterialsUseCase: FindMaterialsUseCase;
  let mockMaterialRepository: jest.Mocked<MaterialRepository>;

  beforeEach(() => {
    mockMaterialRepository = {
      findAll: jest.fn(),
      count: jest.fn(),
    } as unknown as jest.Mocked<MaterialRepository>;

    findMaterialsUseCase = new FindMaterialsUseCase(mockMaterialRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find materials successfully with pagination', async () => {
    const paginationOptions: PaginationOptions = { page: 1, limit: 10 };
    const materials: Material[] = [
      new Material(1, 'Material1', 'Description1', 20, 'kg', new Date('2022-02-25'), null, null),
      new Material(2, 'Material2', 'Description2', 30, 'l', new Date('2022-02-26'), null, null),
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

    await expect(findMaterialsUseCase.execute(paginationOptions)).rejects.toThrow(NotFoundError);
    expect(mockMaterialRepository.findAll).toHaveBeenCalledWith(paginationOptions);
  });

  it('should throw DatabaseError when repository throws an error', async () => {
    const paginationOptions: PaginationOptions = { page: 1, limit: 10 };
    const error = new Error('Database error');
    mockMaterialRepository.findAll.mockRejectedValue(error);

    await expect(findMaterialsUseCase.execute(paginationOptions)).rejects.toThrow(DatabaseError);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
