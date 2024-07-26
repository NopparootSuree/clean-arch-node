import { Request, Response } from 'express';
import { UpdateUserDto } from '@application/dtos/user/UpdateUserDto';
import { CreateUserDto } from '@application/dtos/user/CreateUserDto';
import { CreateUserUseCase } from '@application/usecases/user/CreateUserUseCase';
import { FindUsersUseCase } from '@application/usecases/user/FindUsersUseCase';
import { FindUserByIdUseCase } from '@application/usecases/user/FindUserByIdUseCase';
import { UpdateUserUseCase } from '@application/usecases/user/UpdateUserUseCase';
import { DeleteUserUseCase } from '@application/usecases/user/DeleteUserUseCase';
import { plainToClass } from 'class-transformer';
import { UserSerializer } from '@interfaces/serializers/user/UserSerializer';
import { ValidationError } from '@utils/errors';
import { handleError, validateDto, validateId } from '@utils/controller-handler';

export class UserController {
  constructor(
    private createUserUseCase: CreateUserUseCase,
    private findUsersUseCase: FindUsersUseCase,
    private findUserByIdUseCase: FindUserByIdUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    private deleteUserUseCase: DeleteUserUseCase,
    private userSerializer: UserSerializer,
  ) {}
  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const createUserDto = plainToClass(CreateUserDto, req.body);
      await validateDto(createUserDto);
      const user = await this.createUserUseCase.execute(createUserDto);
      res.status(201).json(this.userSerializer.serialize(user));
    } catch (error) {
      handleError(res, error);
    }
  }

  async findUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (page <= 0 || limit <= 0) {
        throw new ValidationError('Page or limit must be greater than 0');
      }

      const paginatedResult = await this.findUsersUseCase.execute({ page, limit });

      res.status(200).json({
        data: paginatedResult.data.map((user) => this.userSerializer.serialize(user)),
        total: paginatedResult.total,
        page: paginatedResult.page,
        limit: paginatedResult.limit,
        totalPages: paginatedResult.totalPages,
      });
    } catch (error) {
      handleError(res, error);
    }
  }

  async findUserById(req: Request, res: Response): Promise<void> {
    try {
      const userId = validateId(req.params.id);
      const user = await this.findUserByIdUseCase.execute(userId);
      res.status(200).json(this.userSerializer.serialize(user));
    } catch (error) {
      handleError(res, error);
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = validateId(req.params.id);
      const updateUserDto = plainToClass(UpdateUserDto, req.body);
      await validateDto(updateUserDto);
      const user = await this.updateUserUseCase.execute(userId, updateUserDto);
      res.status(201).json(this.userSerializer.serialize(user));
    } catch (error) {
      handleError(res, error);
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = validateId(req.params.id);
      const user = await this.deleteUserUseCase.execute(userId);
      res.status(200).json(this.userSerializer.serialize(user));
    } catch (error) {
      handleError(res, error);
    }
  }
}
