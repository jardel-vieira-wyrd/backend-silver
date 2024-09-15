import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prismaService = app.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    // Start a transaction before each test
    await prismaService.$transaction(async (prisma) => {
      // Clean up the database within the transaction
      await prisma.task.deleteMany();
      await prisma.user.deleteMany();
    });
  });

  afterEach(async () => {
    // Rollback the transaction after each test
    await prismaService.$transaction(async (prisma) => {
      await prisma.$queryRaw`ROLLBACK;`;
    });
  });

  it('/auth/register (POST)', async () => {
    await prismaService.$transaction(async (prisma) => {
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ name: 'Test User', email: 'test@example.com', password: 'password' })
        .expect(201);

      expect(response.body).toHaveProperty('user');
      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('name');
      expect(response.body.user).toHaveProperty('email');
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.user.name).toBe('Test User');
    });
  });

  it('/auth/register (POST) - should return 409 if user already exists', async () => {
    await prismaService.$transaction(async (prisma) => {
      // First registration
      await request(app.getHttpServer())
        .post('/auth/register')
        .send({ name: 'Test User', email: 'test@example.com', password: 'password' })
        .expect(201);

      // Second registration with the same email
      const response = await request(app.getHttpServer())
        .post('/auth/register')
        .send({ name: 'Test User', email: 'test@example.com', password: 'password' })
        .expect(409);

      expect(response.body).toHaveProperty('message', 'Email already exists');
    });
  });

  // Add more tests for login, etc.
});
