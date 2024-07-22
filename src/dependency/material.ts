import { DatabaseMaterialRepository } from '@infrastructure/database/material/DatabaseMaterialRepository';
import { TransactionManager } from '@infrastructure/database/TransactionManager';
import { CreateMaterialUseCase } from '@application/use-cases/material/CreateMaterialUseCase';
import { FindMaterialByIdUseCase } from '@application/use-cases/material/FindMaterialByIdUseCase';
import { FindMaterialsUseCase } from '@application/use-cases/material/FindMaterialsUseCase';
import { UpdateMaterialUseCase } from '@application/use-cases/material/UpdateMaterialUseCase';
import { DeleteMaterialUseCase } from '@application/use-cases/material/DeleteMaterialUseCase';
import { MaterialController } from '@interfaces/controllers/material/MaterialController';
import { MaterialSerializer } from '@interfaces/serializers/material/MaterialSerializer';

export function materialGroupController(transactionManager: TransactionManager, materialRepository: DatabaseMaterialRepository): MaterialController {
  const createMaterialUseCase = new CreateMaterialUseCase(materialRepository, transactionManager);
  const findMaterialByIdUseCase = new FindMaterialByIdUseCase(materialRepository);
  const findMaterialsUseCase = new FindMaterialsUseCase(materialRepository);
  const updateMaterialUseCase = new UpdateMaterialUseCase(materialRepository, transactionManager);
  const deleteMaterialUseCase = new DeleteMaterialUseCase(materialRepository, transactionManager);
  const materialSerializer = new MaterialSerializer();
  const materialController = new MaterialController(createMaterialUseCase, findMaterialsUseCase, findMaterialByIdUseCase, updateMaterialUseCase, deleteMaterialUseCase, materialSerializer);
  return materialController;
}
