import { User } from '@domain/entities/user/User';

export class UserSerializer {
  serialize(user: User) {
    return {
      id: user.id,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      department: user.department,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deleteAt: user.deletedAt,
      role: user.role,
    };
  }
}
