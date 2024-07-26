import { Request, Response } from 'express';
import { UpdateUserDto } from '@application/dtos/user/UpdateUserDto';
import { CreateUserDto } from '@application/dtos/user/CreateUserDto';
import { CreateUserUseCase } from '@application/use-cases/user/CreateUserUseCase';
import { FindUsersUseCase } from '@application/use-cases/user/FindUsersUseCase';
import { FindUserByIdUseCase } from '@application/use-cases/user/FindUserByIdUseCase';
import { UpdateUserUseCase } from '@application/use-cases/user/UpdateUserUseCase';
import { DeleteUserUseCase } from '@application/use-cases/user/DeleteUserUseCase';
import { plainToClass } from 'class-transformer';
import { UserSerializer } from '@interfaces/serializers/user/UserSerializer';

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
      const user = await this.createUserUseCase.execute(createUserDto);
      res.status(201).json(this.userSerializer.serialize(user));
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async findUsers(req: Request, res: Response): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const paginatedResult = await this.findUsersUseCase.execute({ page, limit });

      res.status(200).json({
        data: paginatedResult.data.map((user) => this.userSerializer.serialize(user)),
        total: paginatedResult.total,
        page: paginatedResult.page,
        limit: paginatedResult.limit,
        totalPages: paginatedResult.totalPages,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async findUserById(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params
        const userId = parseInt(id)
        const user = await this.findUserByIdUseCase.execute(userId)
        user? res.status(200).json(this.userSerializer.serialize(user)) : null;
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = parseInt(id);
      const updateUserDto = plainToClass(UpdateUserDto, req.body);
      const user = await this.updateUserUseCase.execute(userId, updateUserDto);

      res.status(201).json(this.userSerializer.serialize(user));
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
        const { id } = req.params;
        const userId = parseInt(id)
        const user = await this.deleteUserUseCase.execute(userId);
  
        res.status(200).json(this.userSerializer.serialize(user));
    } catch (error) {
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
          } else {
            res.status(500).json({ error: 'Internal server error' });
          }
    }
  }
}
