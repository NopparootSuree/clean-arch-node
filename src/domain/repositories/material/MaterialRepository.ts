import { Material } from '../../../domain/entities/material/Material'
import { Transaction } from '../../../infrastructure/database/Transaction'

export interface MaterialRepository {
    findById(id: number): Promise<Material | null>
    findAll(): Promise<Material[]>
    create(material: Material, transaction?: Transaction): Promise<Material>
    update(material: Material, transaction?: Transaction): Promise<Material>
    delete(id: number, transaction?: Transaction): Promise<void>
}
