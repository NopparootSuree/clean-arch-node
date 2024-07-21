import { CreateMaterialUseCase } from '@application/use-cases/material/CreateMaterialUseCase'
import { MaterialRepository } from '@domain/repositories/material/MaterialRepository'
import { TransactionManager } from '@infrastructure/database/TransactionManager'
import { CreateMaterialDto } from '@application/dtos/material/CreateMaterialDto'
import { Material } from '@domain/entities/material/Material'

describe('CreateMaterialUseCase', () => {
    let createMaterialUseCase: CreateMaterialUseCase
    let mockMaterialRepository: jest.Mocked<MaterialRepository>
    let mockTransactionManager: jest.Mocked<TransactionManager>

    beforeEach(() => {
        mockMaterialRepository = {
            create: jest.fn(),
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findAll: jest.fn(),
        } as jest.Mocked<MaterialRepository>

        mockTransactionManager = {
            runInTransaction: jest
                .fn()
                .mockImplementation((callback) => callback({})),
        } as unknown as jest.Mocked<TransactionManager>

        createMaterialUseCase = new CreateMaterialUseCase(
            mockMaterialRepository,
            mockTransactionManager
        )
    })

    it('should update a new material', async () => {
        const dto: CreateMaterialDto = {
            name: 'Test Material',
            description: 'Test Description',
            quantity: 10,
            unit: 'pcs',
        }

        const createdMaterial = new Material(
            1,
            dto.name,
            dto.description!,
            dto.quantity,
            dto.unit,
            new Date(),
            new Date(),
            null
        )
        mockMaterialRepository.create.mockResolvedValue(createdMaterial)

        const result = await createMaterialUseCase.execute(dto)

        expect(mockMaterialRepository.create).toHaveBeenCalledWith(
            expect.any(Material),
            expect.anything()
        )
        expect(result).toEqual(createdMaterial)
    })
})
