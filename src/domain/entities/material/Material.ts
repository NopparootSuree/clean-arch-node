export class Material {
    constructor(
      public id: number,
      public name: string,
      public description: string | null,
      public quantity: number,
      public unit: string,
      public createdAt: Date,
      public updatedAt: Date | null,
      public deletedAt: Date | null
    ) {}
  }