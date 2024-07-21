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
      const materials = await this.findMaterialsUseCase.execute();
      res.status(200).json(materials);
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
      const findMaterialById = await this.findMaterialByIdUseCase.execute(userId);
      const updateMaterialDto = plainToClass(UpdateMaterialDto, findMaterialById);
      const material = await this.updateMaterialUseCase.execute(updateMaterialDto);
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
      const findMaterialById = await this.findMaterialByIdUseCase.execute(userId);
      if (findMaterialById) {
        const material = await this.deleteMaterialUseCase.execute(findMaterialById);
        res.status(200).json(this.materialSerializer.serialize(material));
      } else {
        throw new Error('bad request');
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}
