import { PrismaClient } from '@prisma/client';
import { DatabaseMaterialRepository } from '../../src/infrastructure/database/material/DatabaseMaterialRepository';
import { Material } from '../../src/domain/entities/Material';

describe('DatabaseMaterialRepository', () => {
  let prisma: PrismaClient;
  let repository: DatabaseMaterialRepository;

  beforeAll(async () => {
    prisma = new PrismaClient();
    repository = new DatabaseMaterialRepository(prisma);
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create and retrieve a material', async () => {
    const material = new Material(0, 'Test Material', 'Description', 10, 'pcs', new Date(), new Date());
    
    const createdMaterial = await repository.create(material);
    expect(createdMaterial.id).toBeDefined();

    const retrievedMaterial = await repository.findById(createdMaterial.id);
    expect(retrievedMaterial).toEqual(createdMaterial);
  });
});