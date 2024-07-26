export class User {
  constructor(
    public id: number,
    public username: string,
    public firstName: string,
    public lastName: string,
    public phone: string | null,
    public department: string | null,
    public createdAt: Date,
    public updatedAt: Date,
    public deletedAt: Date | null,
    public role: string,
  ) {}
}
