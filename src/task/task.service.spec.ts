import { Test, TestingModule } from '@nestjs/testing';
import { TaskService } from './task.service';
import { PrismaService } from '../prisma/prisma.service';
import { Task, TaskStatus } from '@prisma/client';
import { PermissionLevel } from '@prisma/client';

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
    taskPermission: {
      create: jest.fn(),
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
          id: 1,
          title: 'Test Task',
          project: 'Test Project',
          status: TaskStatus.TO_DO,
          description: '',
          priority: 0,
          deadline: null,
          list: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockPrismaService.task.findMany.mockResolvedValue(mockTasks);

      const result = await service.tasks();
      expect(result).toEqual(mockTasks);
      expect(mockPrismaService.task.findMany).toHaveBeenCalledWith();
    });
  });

  describe('task', () => {
    it('should return a single task', async () => {
      const mockTask: Task = {
        id: 1,
        title: 'Test Task',
        project: 'Test Project',
        status: TaskStatus.TO_DO,
        description: '',
        priority: 0,
        deadline: null,
        list: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.task.findUnique.mockResolvedValue(mockTask);

      const result = await service.task({ id: 1 });
      expect(result).toEqual(mockTask);
      expect(mockPrismaService.task.findUnique).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'New Task',
        project: 'New Project',
        status: TaskStatus.TO_DO,
        description: 'Task description',
        priority: 1,
        deadline: new Date(),
        list: 'To-Do List',
      };
      const mockTask: Task = { ...taskData, id: 1, createdAt: new Date(), updatedAt: new Date() };
      mockPrismaService.task.create.mockResolvedValue(mockTask);
      mockPrismaService.taskPermission.create.mockResolvedValue({});

      const userId = 1;
      const result = await service.createTask(taskData, userId);
      expect(result).toEqual(mockTask);
      expect(mockPrismaService.task.create).toHaveBeenCalledWith({ data: taskData });
      expect(mockPrismaService.taskPermission.create).toHaveBeenCalledWith({
        data: {
          user: { connect: { id: userId } },
          task: { connect: { id: mockTask.id } },
          role: PermissionLevel.OWNER,
        },
      });
    });
  });

  describe('updateTask', () => {
    it('should update an existing task', async () => {
      const taskData = {
        title: 'Updated Task',
        status: TaskStatus.DOING,
      };
      const mockTask: Task = {
        id: 1,
        title: 'Updated Task',
        project: 'Test Project',
        status: TaskStatus.DOING,
        description: '',
        priority: 0,
        deadline: null,
        list: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.task.update.mockResolvedValue(mockTask);

      const result = await service.updateTask({ where: { id: 1 }, data: taskData });
      expect(result).toEqual(mockTask);
      expect(mockPrismaService.task.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: taskData,
      });
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      const mockTask: Task = {
        id: 1,
        title: 'Test Task',
        project: 'Test Project',
        status: TaskStatus.TO_DO,
        description: '',
        priority: 0,
        deadline: null,
        list: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPrismaService.task.delete.mockResolvedValue(mockTask);

      const result = await service.deleteTask({ id: 1 });
      expect(result).toEqual(mockTask);
      expect(mockPrismaService.task.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });
  });

  describe('getUserProjects', () => {
    it('should return tasks grouped by project name for a specific user', async () => {
      const userId = 1;
      const groupBy = 'project';
      const mockTasks = [
        {
          id: 1,
          title: 'Task 1',
          project: 'Project 1',
          status: TaskStatus.TO_DO,
          description: '',
          priority: 0,
          deadline: null,
          list: '',
          createdAt: new Date(),
          updatedAt: new Date(),
          taskPermissions: [
            {
              user: { id: 1, email: 'test@example.com', name: 'Test User' },
              role: PermissionLevel.OWNER,
            },
          ],
        },
        // ... other mock tasks ...
      ];
      mockPrismaService.task.findMany.mockResolvedValue(mockTasks);

      const result = await service.getUserProjects(userId, groupBy);
      expect(result).toEqual({
        'Project 1': [
          {
            ...mockTasks[0],
            userPermissions: [
              { userId: 1, email: 'test@example.com', name: 'Test User', role: PermissionLevel.OWNER },
            ],
          },
        ],
        // ... other projects ...
      });
      expect(mockPrismaService.task.findMany).toHaveBeenCalledWith({
        where: {
          taskPermissions: {
            some: {
              userId: userId,
            },
          },
        },
        take: 100,
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' },
        ],
        include: {
          taskPermissions: {
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  name: true,
                },
              },
            },
          },
        },
      });
    });
  });
});
