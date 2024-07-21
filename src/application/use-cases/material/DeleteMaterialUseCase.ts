import { Material } from '@domain/entities/material/Material'
import { MaterialRepository } from '@domain/repositories/material/MaterialRepository'
import { TransactionManager } from '@infrastructure/database/TransactionManager'
import { logger } from '@utils/logger'

export class DeleteMaterialUseCase {
    constructor(
        private materialRepository: MaterialRepository,
        private transactionManager: TransactionManager
    ) {}

    async execute(material: Material): Promise<Material> {
        try {
            return this.transactionManager.runInTransaction(
                async (transaction) => {
                    material.deletedAt = new Date()
                    const deletedMaterial =
                        await this.materialRepository.delete(
                            material,
                            transaction
                        )
                    logger.info(
                        { materialId: deletedMaterial.id },
                        'Material deleted successfully'
                    )
                    return deletedMaterial
                }
            )
        } catch (error) {
            logger.error({ error, material }, 'Failed to delete material')
            throw new Error('Failed to delete material')
        }
    }
}
