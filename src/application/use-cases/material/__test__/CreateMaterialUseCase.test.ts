import { CreateMaterialUseCase } from '../CreateMaterialUseCase';
import { MaterialRepository } from '../../../../domain/repositories/MaterialRepository';
import { TransactionManager } from '../../../../infrastructure/database/TransactionManager';
import { CreateMaterialDto } from '../../../dtos/CreateMaterialDto';
import { Material } from '../../../../domain/entities/Material';

describe('CreateMaterialUseCase', () => {
  let createMaterialUseCase: CreateMaterialUseCase;
  let mockMaterialRepository: jest.Mocked<MaterialRepository>;
  let mockTransactionManager: jest.Mocked<TransactionManager>;

  beforeEach(() => {
    mockMaterialRepository = {
      create: jest.fn(),
    } as any;
    mockTransactionManager = {
      runInTransaction: jest.fn((callback) => callback({})),
    } as any;

    createMaterialUseCase = new CreateMaterialUseCase(
      mockMaterialRepository,
      mockTransactionManager
    );
  });

  it('should create a new material', async () => {
    const dto: CreateMaterialDto = {
      name: 'Test Material',
      description: 'Test Description',
      quantity: 10,
      unit: 'pcs',
    };

    const createdMaterial = new Material(1, dto.name, dto.description!, dto.quantity, dto.unit, new Date(), new Date());
    mockMaterialRepository.create.mockResolvedValue(createdMaterial);

    const result = await createMaterialUseCase.execute(dto);

    expect(mockMaterialRepository.create).toHaveBeenCalledWith(expect.any(Material), expect.anything());
    expect(result).toEqual(createdMaterial);
  });
});