import { Material } from '@domain/entities/material/Material'
import { MaterialRepository } from '@domain/repositories/material/MaterialRepository'
import { TransactionManager } from '@infrastructure/database/TransactionManager'
import { UpdateMaterialDto } from '@application/dtos/material/UpdateMaterialDto'
import { validate } from 'class-validator'
import { logger } from '@utils/logger'

export class UpdateMaterialUseCase {
    constructor(
        private materialRepository: MaterialRepository,
        private transactionManager: TransactionManager
    ) {}

    async execute(materialData: UpdateMaterialDto): Promise<Material> {
        try {
            const errors = await validate(materialData)

            if (errors.length > 0) {
                const errorMessage = `Validation failed: ${errors.map((error) => Object.values(error.constraints!)).join(', ')}`
                logger.error({ materialData, errors }, errorMessage)
                throw new Error(errorMessage)
            }

            return this.transactionManager.runInTransaction(
                async (transaction) => {
                    const material = new Material(
                        0,
                        materialData.name,
                        materialData.description || null,
                        materialData.quantity,
                        materialData.unit,
                        materialData.createdAt,
                        new Date(),
                        null
                    )

                    const updatedMaterial = await this.materialRepository.update(material, transaction);
                    logger.info({materialId: material.id}, 'Material updated successfully')
                    return updatedMaterial;
                }
            )
        } catch (error) {
            logger.error({error: materialData}, 'Failed to updated material')
            throw new Error('Failed to updated material')
        }
    }
}
