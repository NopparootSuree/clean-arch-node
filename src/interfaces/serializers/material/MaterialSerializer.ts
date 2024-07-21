import { Material } from '../../../domain/entities/material/Material'

export class MaterialSerializer {
    serialize(material: Material) {
        return {
            id: material.id,
            name: material.name,
            description: material.description,
            quantity: material.quantity,
            unit: material.unit,
            createdAt: material.createdAt,
            updatedAt: material.updatedAt,
            deleteAt: material.deletedAt,
        }
    }
}
