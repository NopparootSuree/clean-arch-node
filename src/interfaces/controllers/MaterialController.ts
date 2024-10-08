import { Request, Response } from 'express';
import { CreateMaterialUseCase, FindMaterialsUseCase, FindMaterialByIdUseCase, UpdateMaterialUseCase, DeleteMaterialUseCase } from '@domain/usecases/material';
import { MaterialSerializer } from '@interfaces/serializers/MaterialSerializer';
import { CreateMaterialDto } from '@interfaces/dtos/material/CreateMaterialDto';
import { UpdateMaterialDto } from '@interfaces/dtos/material/UpdateMaterialDto';
import { plainToClass } from 'class-transformer';
import { ValidationError } from '@utils/errors/baseError.utils';
import { handleError, validateDto, validateId } from '@utils/controller.utils';

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
      await validateDto(createMaterialDto);
      const result = await this.createMaterialUseCase.execute(createMaterialDto);
      res.status(201).json(this.materialSerializer.serialize(result));
    } catch (error: unknown) {
      handleError(res, error);
    }
  }

  async findMaterials(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (page <= 0 || limit <= 0) {
        throw new ValidationError('Page or limit must be greater than 0');
      }

      const paginatedResult = await this.findMaterialsUseCase.execute({ page, limit });
      res.status(200).json({
        data: paginatedResult.data.map((material) => this.materialSerializer.serialize(material)),
        total: paginatedResult.total,
        page: paginatedResult.page,
        limit: paginatedResult.limit,
        totalPages: paginatedResult.totalPages,
      });
    } catch (error) {
      handleError(res, error);
    }
  }

  async findMaterialById(req: Request, res: Response): Promise<void> {
    try {
      const materialId = validateId(req.params.id);
      const result = await this.findMaterialByIdUseCase.execute(materialId);
      res.status(200).json(this.materialSerializer.serialize(result));
    } catch (error) {
      handleError(res, error);
    }
  }

  async updateMaterial(req: Request, res: Response): Promise<void> {
    try {
      const materialId = validateId(req.params.id);
      const updateMaterialDto = plainToClass(UpdateMaterialDto, req.body);
      await validateDto(updateMaterialDto);
      const result = await this.updateMaterialUseCase.execute(materialId, updateMaterialDto);
      res.status(200).json(this.materialSerializer.serialize(result));
    } catch (error) {
      handleError(res, error);
    }
  }

  async deleteMaterial(req: Request, res: Response): Promise<void> {
    try {
      const materialId = validateId(req.params.id);
      const result = await this.deleteMaterialUseCase.execute(materialId);
      res.status(200).json(this.materialSerializer.serialize(result));
    } catch (error) {
      handleError(res, error);
    }
  }
}
