import { Request, Response } from 'express';
import { CreateMaterialUseCase } from '@application/use-cases/material/CreateMaterialUseCase';
import { FindMaterialsUseCase } from '@application/use-cases/material/FindMaterialsUseCase';
import { FindMaterialByIdUseCase } from '@application/use-cases/material/FindMaterialByIdUseCase';
import { UpdateMaterialUseCase } from '@application/use-cases/material/UpdateMaterialUseCase';
import { MaterialSerializer } from '@interfaces/serializers/material/MaterialSerializer';
import { DeleteMaterialUseCase } from '@application/use-cases/material/DeleteMaterialUseCase';
import { CreateMaterialDto } from '@application/dtos/material/CreateMaterialDto';
import { UpdateMaterialDto } from '@application/dtos/material/UpdateMaterialDto';
import { plainToClass } from 'class-transformer';

export class MaterialController {
  constructor(
    private createMaterialUseCase: CreateMaterialUseCase,
    private findMaterialsUseCase: FindMaterialsUseCase,
    private findMaterialByIdUseCase: FindMaterialByIdUseCase,
    private updateMaterialUseCase: UpdateMaterialUseCase,
    private deleteMaterialUseCase: DeleteMaterialUseCase,
    private materialSerializer: MaterialSerializer,
  ) {}

  async createMaterial(req: Request, res: Response): Promise<void> {
    try {
      const createMaterialDto = plainToClass(CreateMaterialDto, req.body);
      const material = await this.createMaterialUseCase.execute(createMaterialDto);
      res.status(201).json(this.materialSerializer.serialize(material));
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async findMaterials(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const paginatedResult = await this.findMaterialsUseCase.execute({ page, limit });

      res.status(200).json({
        data: paginatedResult.data.map((material) => this.materialSerializer.serialize(material)),
        total: paginatedResult.total,
        page: paginatedResult.page,
        limit: paginatedResult.limit,
        totalPages: paginatedResult.totalPages,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async findMaterialById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = parseInt(id);
      const material = await this.findMaterialByIdUseCase.execute(userId);
      material ? res.status(200).json(this.materialSerializer.serialize(material)) : null;
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async updateMaterial(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = parseInt(id);
      const updateMaterialDto = plainToClass(UpdateMaterialDto, req.body);
      const material = await this.updateMaterialUseCase.execute(userId, updateMaterialDto);
      res.status(200).json(this.materialSerializer.serialize(material));
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async deleteMaterial(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = parseInt(id);
      const material = await this.deleteMaterialUseCase.execute(userId);
      res.status(200).json(this.materialSerializer.serialize(material));
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
