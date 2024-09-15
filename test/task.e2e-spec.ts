import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

describe('TaskController (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    prismaService = app.get<PrismaService>(PrismaService);
    jwtService = app.get<JwtService>(JwtService);
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

  it('/tasks (GET)', async () => {
    const user = await prismaService.user.create({
      data: {
        email: `test${Date.now()}@example.com`,
        password: 'password',
      },
    });

    await prismaService.task.create({
      data: {
        title: 'Test Task',
        project: 'Test Project'
      },
    });

    const token = jwtService.sign({ email: user.email, sub: user.id });

    const response = await request(app.getHttpServer())
      .get('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0]).toHaveProperty('title', 'Test Task');
  });

  // it('/tasks (POST)', async () => {
  //   const user = await prismaService.user.create({
  //     data: {
  //       email: `test${Date.now()}@example.com`,
  //       password: 'password',
  //     },
  //   });

  //   const token = jwtService.sign({ email: user.email, sub: user.id });

  //   const response = await request(app.getHttpServer())
  //     .post('/tasks')
  //     .set('Authorization', `Bearer ${token}`)
  //     .send({
  //       title: 'New Test Task',
  //       project: 'New Test Project',
  //     })
  //     .expect(201);

  //   expect(response.body).toHaveProperty('id');
  //   expect(response.body.title).toBe('New Test Task');
  //   expect(response.body.project).toBe('New Test Project');
  //   expect(response.body.createdById).toBe(user.id);
  // });


});
