export class User {
    constructor(
      public id: number,
      public firstName: string,
      public lastName: string | null,
      public email: string,
      public phone: string | null,
      public department: string | null,
      public createdAt: Date,
      public updatedAt: Date,
      public deleteAt: Date | null
    ) {}
  }