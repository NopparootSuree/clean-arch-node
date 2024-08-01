import { DatabaseMaterialRepository } from '@infrastructure/database/DatabaseMaterialRepository';
import { TransactionManager } from '@infrastructure/database/TransactionManager';
import { CreateMaterialUseCase, FindMaterialByIdUseCase, FindMaterialsUseCase, UpdateMaterialUseCase, DeleteMaterialUseCase } from '@domain/usecases/material';
import { MaterialController } from '@interfaces/controllers/MaterialController';
import { MaterialSerializer } from '@interfaces/serializers/MaterialSerializer';

export function materialDependencies(transactionManager: TransactionManager, materialRepository: DatabaseMaterialRepository): MaterialController {
  const createMaterialUseCase = new CreateMaterialUseCase(materialRepository, transactionManager);
  const findMaterialByIdUseCase = new FindMaterialByIdUseCase(materialRepository);
  const findMaterialsUseCase = new FindMaterialsUseCase(materialRepository);
  const updateMaterialUseCase = new UpdateMaterialUseCase(materialRepository, transactionManager);
  const deleteMaterialUseCase = new DeleteMaterialUseCase(materialRepository, transactionManager);
  const materialSerializer = new MaterialSerializer();
  return new MaterialController(createMaterialUseCase, findMaterialsUseCase, findMaterialByIdUseCase, updateMaterialUseCase, deleteMaterialUseCase, materialSerializer);
}
