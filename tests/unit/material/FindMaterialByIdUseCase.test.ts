import { Material } from '@domain/entities/material/Material';
import { MaterialRepository } from '@domain/repositories/material/MaterialRepository';
import { FindMaterialByIdUseCase } from '@application/use-cases/material/FindMaterialByIdUseCase';
import { logger } from '@utils/logger';

jest.mock('@utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
  },
}));

describe('FindMaterialByIdUseCase', () => {
  let findMaterialByIdUseCase: FindMaterialByIdUseCase;
  let mockMaterialRepository: jest.Mocked<MaterialRepository>;

  beforeEach(() => {
    mockMaterialRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<MaterialRepository>;

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
    expect(logger.info).toHaveBeenCalledWith(`Material was found id = ${materialId}`);
  });

  it('should throw an error when material is not found', async () => {
    const materialId = 999;
    mockMaterialRepository.findById.mockResolvedValue(null);

    await expect(findMaterialByIdUseCase.execute(materialId)).rejects.toThrow('Material not found');
    expect(logger.error).toHaveBeenCalledWith('Material not found');
  });

  it('should throw an error when repository throws an error', async () => {
    const materialId = 1;
    const error = new Error('Failed to find by id material');
    mockMaterialRepository.findById.mockRejectedValue(error);

    await expect(findMaterialByIdUseCase.execute(materialId)).rejects.toThrow('Failed to find by id material');
    expect(logger.error).toHaveBeenCalledWith('Failed to find by id material');
  });
});
