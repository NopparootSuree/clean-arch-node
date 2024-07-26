import { DatabaseMaterialRepository } from '@infrastructure/database/material/DatabaseMaterialRepository';
import { TransactionManager } from '@infrastructure/database/TransactionManager';
import { CreateMaterialUseCase } from '@application/usecases/material/CreateMaterialUseCase';
import { FindMaterialByIdUseCase } from '@application/usecases/material/FindMaterialByIdUseCase';
import { FindMaterialsUseCase } from '@application/usecases/material/FindMaterialsUseCase';
import { UpdateMaterialUseCase } from '@application/usecases/material/UpdateMaterialUseCase';
import { DeleteMaterialUseCase } from '@application/usecases/material/DeleteMaterialUseCase';
import { MaterialController } from '@interfaces/controllers/material/MaterialController';
import { MaterialSerializer } from '@interfaces/serializers/material/MaterialSerializer';

export function materialDependencies(transactionManager: TransactionManager, materialRepository: DatabaseMaterialRepository): MaterialController {
  const createMaterialUseCase = new CreateMaterialUseCase(materialRepository, transactionManager);
  const findMaterialByIdUseCase = new FindMaterialByIdUseCase(materialRepository);
  const findMaterialsUseCase = new FindMaterialsUseCase(materialRepository);
  const updateMaterialUseCase = new UpdateMaterialUseCase(materialRepository, transactionManager);
  const deleteMaterialUseCase = new DeleteMaterialUseCase(materialRepository, transactionManager);
  const materialSerializer = new MaterialSerializer();
  return new MaterialController(createMaterialUseCase, findMaterialsUseCase, findMaterialByIdUseCase, updateMaterialUseCase, deleteMaterialUseCase, materialSerializer);
}
