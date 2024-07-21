import { Request, Response } from 'express';
import { CreateMaterialUseCase } from '../../../application/use-cases/material/CreateMaterialUseCase';
import { MaterialSerializer } from '../../serializers/material/MaterialSerializer';
import { CreateMaterialDto } from '../../../application/dtos/material/CreateMaterialDto';
import { plainToClass } from 'class-transformer';

export class MaterialController {
  constructor(
    private createMaterialUseCase: CreateMaterialUseCase,
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
}
