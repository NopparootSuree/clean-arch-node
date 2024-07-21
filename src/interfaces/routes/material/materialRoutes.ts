import express from 'express'
import { MaterialController } from '@interfaces/controllers/material/MaterialController'

export function createMaterialRoutes(materialController: MaterialController) {
    const router = express.Router()

    router.post('/', (req, res) => materialController.createMaterial(req, res))

    return router
}
