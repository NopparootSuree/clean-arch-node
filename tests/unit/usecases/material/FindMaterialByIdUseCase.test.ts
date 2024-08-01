import { Material } from '@domain/entities/material/Material';
import { MaterialRepository } from '@domain/repositories/MaterialRepository';
import { FindMaterialByIdUseCase } from '@domain/usecases/material/FindMaterialByIdUseCase';
import { DatabaseError, NotFoundError } from '@utils/errors';

jest.mock('@domain/repositories/MaterialRepository');

describe('FindMaterialByIdUseCase', () => {
  let findMaterialByIdUseCase: FindMaterialByIdUseCase;
  let mockMaterialRepository: jest.Mocked<MaterialRepository>;

  beforeEach(() => {
    mockMaterialRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<MaterialRepository>;

    findMaterialByIdUseCase = new FindMaterialByIdUseCase(mockMaterialRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find an existing material by id', async () => {
    const materialId = 1;

    const material: Material = {
      id: 1,
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
  });

  it('should throw an error when material is not found', async () => {
    const materialId = 1;
    mockMaterialRepository.findById.mockResolvedValue(null);

    await expect(findMaterialByIdUseCase.execute(materialId)).rejects.toThrow(NotFoundError);
    expect(mockMaterialRepository.findById).toHaveBeenCalledWith(materialId);
  });

  it('should throw DatabaseError when repository throws an error', async () => {
    const materialId = 1;
    mockMaterialRepository.findById.mockRejectedValue(new Error('Database error'));

    await expect(findMaterialByIdUseCase.execute(materialId)).rejects.toThrow(DatabaseError);
    expect(mockMaterialRepository.findById).toHaveBeenCalledWith(materialId);
  });

  it('should handle and rethrow other unexpected errors as DatabaseError', async () => {
    const materialId = 1;
    const unexpectedError = new Error('Unexpected error');
    mockMaterialRepository.findById.mockRejectedValue(unexpectedError);

    await expect(findMaterialByIdUseCase.execute(materialId)).rejects.toThrow(DatabaseError);
    expect(mockMaterialRepository.findById).toHaveBeenCalledWith(materialId);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
});
