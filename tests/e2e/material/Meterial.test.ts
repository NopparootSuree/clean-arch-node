import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { createApp } from 'app';

describe('Material API', () => {
  let prisma: PrismaClient;
  let app: ReturnType<typeof createApp>;

  beforeAll(async () => {
    prisma = new PrismaClient();
    await prisma.$connect();
    app = createApp(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a new material', async () => {
    const response = await request(app).post('/api/materials').send({
      name: 'E2E Test Material',
      description: 'Created during E2E test',
      quantity: 5,
      unit: 'kg',
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('E2E Test Material');
  });
});
