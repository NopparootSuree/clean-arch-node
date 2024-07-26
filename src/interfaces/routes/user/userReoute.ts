import express from 'express';
import { UserController } from '@interfaces/controllers/user/UserController';

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API Endpoints for managing users
 */

export function createUserRoutes(userController: UserController) {
  const router = express.Router();

  /**
   * @swagger
   *   /:
   *     post:
   *       summary: Create a new user
   *       description: Creates a new user with the provided information
   *       tags: [Users]
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CreateUserDto'
   *       responses:
   *         '201':
   *           description: Created
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/User'
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
  router.post('/', (req, res) => userController.createUser(req, res));

  /**
   * @swagger
   *   /:
   *     get:
   *       summary: Get paginated list of users
   *       description: Retrieves a paginated list of users
   *       tags: [Users]
   *       parameters:
   *         - in: query
   *           name: page
   *           schema:
   *             type: integer
   *             minimum: 1
   *             default: 1
   *           description: Page number
   *         - in: query
   *           name: limit
   *           schema:
   *             type: integer
   *             minimum: 1
   *             maximum: 100
   *             default: 10
   *           description: Number of items per page
   *       responses:
   *         '200':
   *           description: Successful operation
   *           content:
   *             application/json:
   *               schema:
   *                 type: object
   *                 properties:
   *                   data:
   *                     type: array
   *                     items:
   *                       $ref: '#/components/schemas/User'
   *                   total:
   *                     type: integer
   *                     description: Total number of users
   *                   page:
   *                     type: integer
   *                     description: Current page number
   *                   limit:
   *                     type: integer
   *                     description: Number of items per page
   *                   totalPages:
   *                     type: integer
   *                     description: Total number of pages
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
  router.get('/', (req, res) => userController.findUsers(req, res));

  /**
   * @swagger
   *   /{id}:
   *     get:
   *       summary: Get a user by ID
   *       description: Retrieves a specific user by their ID
   *       tags: [Users]
   *       parameters:
   *         - in: path
   *           name: id
   *           required: true
   *           schema:
   *             type: integer
   *           description: The ID of the user to retrieve
   *       responses:
   *         '200':
   *           description: Successful operation
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/User'
   *         '404':
   *           description: User not found
   *         '500':
   *           description: Internal Server Error
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/Error'
   */
  router.get('/:id', (req, res) => userController.findUserById(req, res));

  /**
   * @swagger
   *   /{id}:
   *     put:
   *       summary: Update a user
   *       description: Updates an existing user with the provided information
   *       tags: [Users]
   *       parameters:
   *         - in: path
   *           name: id
   *           required: true
   *           schema:
   *             type: integer
   *           description: The ID of the user to update
   *       requestBody:
   *         required: true
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UpdateUserDto'
   *       responses:
   *         '200':
   *           description: Successful operation
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/User'
   *         '400':
   *           description: Bad Request
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/Error'
   *         '404':
   *           description: User not found
   *         '500':
   *           description: Internal Server Error
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/Error'
   */
  router.put('/:id', (req, res) => userController.updateUser(req, res));

  /**
   * @swagger
   *   /{id}:
   *     delete:
   *       summary: Delete a user
   *       description: Deletes a specific user by their ID
   *       tags: [Users]
   *       parameters:
   *         - in: path
   *           name: id
   *           required: true
   *           schema:
   *             type: integer
   *           description: The ID of the user to delete
   *       responses:
   *         '200':
   *           description: Successful operation
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/User'
   *         '400':
   *           description: Bad Request
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/Error'
   *         '404':
   *           description: User not found
   *         '500':
   *           description: Internal Server Error
   *           content:
   *             application/json:
   *               schema:
   *                 $ref: '#/components/schemas/Error'
   */
  router.delete('/:id', (req, res) => userController.deleteUser(req, res));

  /**
   * @swagger
   * components:
   *   schemas:
   *     User:
   *       type: object
   *       properties:
   *         id:
   *           type: integer
   *           description: The unique identifier for the user
   *         username:
   *           type: string
   *           description: The username of the user
   *         firstName:
   *           type: string
   *           description: The first name of the user
   *         lastName:
   *           type: string
   *           description: The last name of the user
   *         phone:
   *           type: string
   *           description: The phone number of the user
   *         department:
   *           type: string
   *           description: The department of the user
   *         role:
   *           type: string
   *           description: The role of the user
   *         createdAt:
   *           type: string
   *           format: date-time
   *           description: The date and time when the user was created
   *         updatedAt:
   *           type: string
   *           format: date-time
   *           nullable: true
   *           description: The date and time when the user was last updated
   *         deletedAt:
   *           type: string
   *           format: date-time
   *           nullable: true
   *           description: The date and time when the user was deleted (for soft deletes)
   *
   *     CreateUserDto:
   *       type: object
   *       required:
   *         - username
   *         - firstName
   *         - lastName
   *         - role
   *       properties:
   *         username:
   *           type: string
   *           description: The username for the new user
   *         password:
   *         firstName:
   *           type: string
   *           description: The first name of the new user
   *         lastName:
   *           type: string
   *           description: The last name of the new user
   *         phone:
   *           type: string
   *           description: The phone number of the new user
   *         department:
   *           type: string
   *           description: The department of the new user
   *         role:
   *           type: string
   *           description: The role of the new user
   *
   *     UpdateUserDto:
   *       type: object
   *       properties:
   *         firstName:
   *           type: string
   *           description: The updated first name of the user
   *         lastName:
   *           type: string
   *           format: string
   *           description: The updated last name of the user
   *         phone:
   *           type: string
   *           description: The updated phone number of the user
   *         department:
   *           type: string
   *           description: The updated department of the user
   *         role:
   *           type: string
   *           description: The updated role of the user
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
