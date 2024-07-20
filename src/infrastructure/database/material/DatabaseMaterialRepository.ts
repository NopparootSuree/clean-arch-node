import { PrismaClient } from '@prisma/client';
import { Material } from '../../../domain/entities/material/Material';
import { MaterialRepository } from '../../../domain/repositories/material/MaterialRepository';
import { Transaction } from '../Transaction';

export class DatabaseMaterialRepository implements MaterialRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: number): Promise<Material | null> {
    const material = await this.prisma.material.findUnique({ where: { id } });
    return material ? this.mapToDomain(material) : null;
  }

  async findAll(): Promise<Material[]> {
    const materials = await this.prisma.material.findMany();
    return materials.map(this.mapToDomain);
  }

  async create(material: Material, transaction?: Transaction): Promise<Material> {
    const client = transaction || this.prisma;
    const createdMaterial = await client.material.create({
      data: {
        name: material.name,
        description: material.description,
        quantity: material.quantity,
        unit: material.unit,
      },
    });
    return this.mapToDomain(createdMaterial);
  }

  async update(material: Material, transaction?: Transaction): Promise<Material> {
    const client = transaction || this.prisma;
    const updatedMaterial = await client.material.update({
      where: { id: material.id },
      data: {
        name: material.name,
        description: material.description,
        quantity: material.quantity,
        unit: material.unit,
      },
    });
    return this.mapToDomain(updatedMaterial);
  }

  async delete(material: Material, transaction?: Transaction): Promise<Material> {
    const client = transaction || this.prisma;
    const updatedMaterial = await client.material.update({
      where: { id: material.id },
      data: {
        deletedAt: new Date
      },
    });
    return this.mapToDomain(updatedMaterial);
  }

  private mapToDomain(material: any): Material {
    return new Material(
      material.id,
      material.name,
      material.description,
      material.quantity,
      material.unit,
      material.createdAt,
      material.updatedAt,
      material.deleteAt
    );
  }
}