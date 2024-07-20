import { Material } from '@domain/entities/material/Material'
import { MaterialRepository } from '@domain/repositories/material/MaterialRepository'
import { logger } from '@utils/logger'

export class FindMaterialByIdUseCase {
    constructor(private materialRepository: MaterialRepository) {}
    async execute(id: number): Promise<Material | null> {
        try {
            const findMaterialById = await this.materialRepository.findById(id);
            logger.info({materialId: id}, 'Material was found');
            return findMaterialById;
        } catch (error) {
            logger.error({error: id},'Failed to find by id material');
            throw new Error('Failed to find by id material');
        }
    }
}
