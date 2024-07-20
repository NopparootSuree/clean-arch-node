import { Material } from '../../domain/entities/Material';

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
    };
  }
}