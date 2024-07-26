import { Material } from '@domain/entities/material/Material';
import { Transaction } from '@infrastructure/database/Transaction';
import { PaginatedResult } from '@application/usecases/material/FindMaterialsUseCase';

export interface MaterialRepository {
  findAll(options: { page: number; limit: number }): Promise<PaginatedResult<Material>>;
  count(): Promise<number>;
  findById(id: number): Promise<Material | null>;
  create(material: Material, transaction?: Transaction): Promise<Material>;
  update(material: Material, transaction?: Transaction): Promise<Material>;
  delete(material: Material, transaction?: Transaction): Promise<Material>;
}
