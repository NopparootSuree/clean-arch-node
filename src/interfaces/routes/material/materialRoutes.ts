import express from 'express';
import { MaterialController } from '@interfaces/controllers/material/MaterialController';

export function createMaterialRoutes(materialController: MaterialController) {
  const router = express.Router();

  router.post('/', (req, res) => materialController.createMaterial(req, res));
  router.post('/', (req, res) => materialController.findMaterials(req, res));
  router.post('/:id', (req, res) => materialController.findMaterialById(req, res));
  router.post('/:id', (req, res) => materialController.updateMaterial(req, res));
  router.post('/:id', (req, res) => materialController.deleteMaterial(req, res));

  return router;
}
