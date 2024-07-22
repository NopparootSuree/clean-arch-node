import express from 'express';
import { MaterialController } from '@interfaces/controllers/material/MaterialController';

/**
 * @swagger
 * tags:
 *   name: Materials
 *   description: API Endpoints for managing materials
 */

export function createMaterialRoutes(materialController: MaterialController) {
  const router = express.Router();

  /**
   * @swagger
   *   /api/materials:
   *     post:
   *       summary: Create a new material
   *       description: Creates a new material with the provided information
   *       tags: [Materials]
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CreateMaterialDto'
   *       responses:
   *         '201':
   *           description: Created
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/Material'
   *         '400':
   *           description: Bad Request
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/Error'
   *         '500':
   *           description: Internal Server Error
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/Error'
   */
  router.post('/', (req, res) => materialController.createMaterial(req, res));

  /**
   * @swagger
   *   /api/materials:
   *     get:
   *       summary: Get all materials
   *       description: Retrieves a list of all materials
   *       tags: [Materials]
   *       responses:
   *         '200':
   *           description: Successful operation
   *           content:
   *             application/json:
   *               schema:
   *                 type: array
   *                 items:
   *                   $ref: '#/components/schemas/Material'
   *         '500':
   *           description: Internal Server Error
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/Error'
   */
  router.get('/', (req, res) => materialController.findMaterials(req, res));

  /**
   * @swagger
   *   /api/materials/{id}:
   *     get:
   *       summary: Get a material by ID
   *       description: Retrieves a specific material by its ID
   *       tags: [Materials]
   *       parameters:
   *         - in: path
   *           name: id
   *           required: true
   *           schema:
   *             type: integer
   *           description: The ID of the material to retrieve
   *       responses:
   *         '200':
   *           description: Successful operation
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/Material'
   *         '404':
   *           description: Material not found
   *         '500':
   *           description: Internal Server Error
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/Error'
   */
  router.get('/:id', (req, res) => materialController.findMaterialById(req, res));

  /**
   * @swagger
   *   /api/materials/{id}:
   *     put:
   *       summary: Update a material
   *       description: Updates an existing material with the provided information
   *       tags: [Materials]
   *       parameters:
   *         - in: path
   *           name: id
   *           required: true
   *           schema:
   *             type: integer
   *           description: The ID of the material to update
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UpdateMaterialDto'
   *       responses:
   *         '200':
   *           description: Successful operation
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/Material'
   *         '400':
   *           description: Bad Request
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/Error'
   *         '404':
   *           description: Material not found
   *         '500':
   *           description: Internal Server Error
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/Error'
   */
  router.put('/:id', (req, res) => materialController.updateMaterial(req, res));

  /**
   * @swagger
   *   /api/materials/{id}:
   *     delete:
   *       summary: Delete a material
   *       description: Deletes a specific material by its ID
   *       tags: [Materials]
   *       parameters:
   *         - in: path
   *           name: id
   *           required: true
   *           schema:
   *             type: integer
   *           description: The ID of the material to delete
   *       responses:
   *         '200':
   *           description: Successful operation
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/Material'
   *         '400':
   *           description: Bad Request
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/Error'
   *         '404':
   *           description: Material not found
   *         '500':
   *           description: Internal Server Error
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/Error'
   *
   *
   */
  router.delete('/:id', (req, res) => materialController.deleteMaterial(req, res));

  /**
   * @swagger
   * components:
   *   schemas:
   *     Material:
   *       type: object
   *       properties:
   *         id:
   *           type: integer
   *           description: The unique identifier for the material
   *         name:
   *           type: string
   *           description: The name of the material
   *         description:
   *           type: string
   *           nullable: true
   *           description: A description of the material
   *         quantity:
   *           type: number
   *           description: The quantity of the material
   *         unit:
   *           type: string
   *           description: The unit of measurement for the material
   *         createdAt:
   *           type: string
   *           format: date-time
   *           description: The date and time when the material was created
   *         updatedAt:
   *           type: string
   *           format: date-time
   *           nullable: true
   *           description: The date and time when the material was last updated
   *         deletedAt:
   *           type: string
   *           format: date-time
   *           nullable: true
   *           description: The date and time when the material was deleted (for soft deletes)
   *
   *     CreateMaterialDto:
   *       type: object
   *       required:
   *         - name
   *         - quantity
   *         - unit
   *       properties:
   *         name:
   *           type: string
   *           description: The name of the material
   *         description:
   *           type: string
   *           nullable: true
   *           description: A description of the material
   *         quantity:
   *           type: number
   *           description: The quantity of the material
   *         unit:
   *           type: string
   *           description: The unit of measurement for the material
   *
   *     UpdateMaterialDto:
   *       type: object
   *       properties:
   *         name:
   *           type: string
   *           description: The updated name of the material
   *         description:
   *           type: string
   *           nullable: true
   *           description: The updated description of the material
   *         quantity:
   *           type: number
   *           description: The updated quantity of the material
   *         unit:
   *           type: string
   *           description: The updated unit of measurement for the material
   *         createdAt:
   *           type: datetime
   *           description: The updated time created for the material
   *
   *     Error:
   *       type: object
   *       properties:
   *         error:
   *           type: string
   *           description: Error message describing the issue
   */

  return router;
}
