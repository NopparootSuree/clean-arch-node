import { PaginatedResult } from '@domain/usecases/material/FindMaterialsUseCase';
import { User } from '@domain/entities/user/User';
import { UserRepository } from '@domain/repositories/UserRepository';
import { PrismaClient } from '@prisma/client';
import { Transaction } from './Transaction';

export class DatabaseUserRepository implements UserRepository {
  constructor(private prisma: PrismaClient) {}

  async findAll(options: { page: number; limit: number }): Promise<PaginatedResult<User>> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        where: { deletedAt: null },
      }),
      this.prisma.user.count({ where: { deletedAt: null } }),
    ]);

    const totalPages = Math.ceil(total / limit);

    return {
      data: users.map(this.mapToDomain),
      total,
      page,
      limit,
      totalPages,
    };
  }

  async count(): Promise<number> {
    return this.prisma.user.count({ where: { deletedAt: null } });
  }
  async findById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id, deletedAt: null },
    });
    return user ? this.mapToDomain(user) : null;
  }
  async create(user: User, transaction?: Transaction): Promise<User> {
    const client = transaction || this.prisma;
    const createdUser = await client.user.create({
      data: {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        department: user.department,
        role: user.role,
      },
    });
    return this.mapToDomain(createdUser);
  }
  async update(user: User, transaction?: Transaction): Promise<User> {
    const client = transaction || this.prisma;
    const updatedUser = await client.user.update({
      where: { id: user.id, deletedAt: null },
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        department: user.department,
        role: user.role,
      },
    });
    return this.mapToDomain(updatedUser);
  }
  async delete(user: User, transaction?: Transaction): Promise<User> {
    const client = transaction || this.prisma;
    const updatedUser = await client.user.update({
      where: { id: user.id, deletedAt: null },
      data: {
        deletedAt: new Date(),
      },
    });
    return this.mapToDomain(updatedUser);
  }

  private mapToDomain(user: User): User {
    return new User(user.id, user.username, user.firstName, user.lastName, user.phone, user.department, user.createdAt, user.updatedAt, user.deletedAt, user.role);
  }
}
