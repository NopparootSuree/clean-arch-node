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
import { AppError, InternalServerError } from '@utils/errors'

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
      const result = await this.createMaterialUseCase.execute(createMaterialDto);
      if (typeof result === 'string') {
        res.status(400).json({error: result})
      } else {
        res.status(201).json(this.materialSerializer.serialize(result));
      }
    } catch (error: unknown) {
      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
      } else if (error instanceof Error) {
        const internalError = new InternalServerError(error.message);
        res.status(internalError.statusCode).json({ error: internalError.message });
      } else {
        const internalError = new InternalServerError();
        res.status(internalError.statusCode).json({ error: internalError.message });
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
      const materialId = parseInt(id);

      if (isNaN(materialId) || materialId <= 0) {
        res.status(400).json({ error: 'Invalid ID. Must be a number.' });
        return;
      }

      const result = await this.findMaterialByIdUseCase.execute(materialId);

      if (typeof result === 'string') {
        res.status(404).json({error: result});
        return
      } else {
        res.status(200).json(this.materialSerializer.serialize(result))
        return
      }
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
      const materialId = parseInt(id);

      
      if (isNaN(materialId) || materialId <= 0) {
        res.status(400).json({ error: 'Invalid ID. Must be a number.' });
        return;
      }

      const updateMaterialDto = plainToClass(UpdateMaterialDto, req.body);
      const result = await this.updateMaterialUseCase.execute(materialId, updateMaterialDto);
      if (typeof result === 'string') {
        res.status(404).json({error: result})
      } else {
        res.status(200).json(this.materialSerializer.serialize(result));
      }
      
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
      const materialId = parseInt(id);

      if (isNaN(materialId) || materialId <= 0) {
        res.status(400).json({ error: 'Invalid ID. Must be a number.' });
        return;
      }

      const result = await this.deleteMaterialUseCase.execute(materialId);

      if (typeof result === 'string') {
        res.status(404).json({error: result})
      } else {
        res.status(200).json(this.materialSerializer.serialize(result));
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
