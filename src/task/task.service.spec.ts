import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from '../prisma/prisma.service';
import { Task, TaskStatus } from '@prisma/client';

describe('TaskService', () => {
  let service: TaskService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    task: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('tasks', () => {
    it('should return an array of tasks', async () => {
      const mockTasks: Task[] = [
        {
          id: 1, title: 'Test Task', project: 'Test Project', status: TaskStatus.TO_DO, createdById: 1, assignedTo: [], readableBy: [], editableBy: [], updatableBy: [], createdAt: new Date(), updatedAt: new Date(),
          description: '',
          priority: 0,
          deadline: undefined,
          list: ''
        },
      ];
      mockPrismaService.task.findMany.mockResolvedValue(mockTasks);

      const result = await service.tasks(1);
      expect(result).toEqual(mockTasks);
      expect(mockPrismaService.task.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { createdById: 1 },
            { updatableBy: { has: 1 } },
            { readableBy: { has: 1 } }
          ]
        }
      });
    });
  });

  describe('task', () => {
    it('should return a single task', async () => {
      const mockTask: Task = {
        id: 1, title: 'Test Task', project: 'Test Project', status: TaskStatus.TO_DO, createdById: 1, assignedTo: [], readableBy: [], editableBy: [], updatableBy: [], createdAt: new Date(), updatedAt: new Date(),
        description: '',
        priority: 0,
        deadline: undefined,
        list: ''
      };
      mockPrismaService.task.findUnique.mockResolvedValue(mockTask);

      const result = await service.task({ id: 1 }, 1);
      expect(result).toEqual(mockTask);
      expect(mockPrismaService.task.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });
  });

  // Add more tests for createTask, updateTask, deleteTask, and getUserProjects methods
});
