import { PrismaClient } from '@prisma/client';
import { Material } from '@domain/entities/material/Material';
import { MaterialRepository } from '@domain/repositories/material/MaterialRepository';
import { Transaction } from '../Transaction';
import { PaginatedResult } from '@application/use-cases/material/FindMaterialsUseCase';

export class DatabaseMaterialRepository implements MaterialRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(options: { page: number; limit: number }): Promise<PaginatedResult<Material>> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;
    const [materials, total] = await Promise.all([
      this.prisma.material.findMany({
        skip,
        take: limit,
        where: { deletedAt: null },
      }),
      this.prisma.material.count({ where: { deletedAt: null } }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: materials.map(this.mapToDomain),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async count(): Promise<number> {
    return this.prisma.material.count({ where: { deletedAt: null } });
  }

  async findById(id: number): Promise<Material | null> {
    const material = await this.prisma.material.findUnique({
      where: { id, deletedAt: null },
    });
    return material ? this.mapToDomain(material) : null;
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
      where: { id: material.id, deletedAt: null },
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
      where: { id: material.id, deletedAt: null },
      data: {
        deletedAt: new Date(),
      },
    });
    return this.mapToDomain(updatedMaterial);
  }

  private mapToDomain(material: Material): Material {
    return new Material(material.id, material.name, material.description, material.quantity, material.unit, material.createdAt, material.updatedAt, material.deletedAt);
  }
}
