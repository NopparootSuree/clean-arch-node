import { User } from '@domain/entities/user/User';
import { Transaction } from '@infrastructure/database/Transaction';
import { PaginatedResult } from '@domain/usecases/material/FindMaterialsUseCase';

export interface UserRepository {
  findAll(options: { page: number; limit: number }): Promise<PaginatedResult<User>>;
  count(): Promise<number>;
  findById(id: number): Promise<User | null>;
  create(User: User, transaction?: Transaction): Promise<User>;
  update(User: User, transaction?: Transaction): Promise<User>;
  delete(User: User, transaction?: Transaction): Promise<User>;
}
