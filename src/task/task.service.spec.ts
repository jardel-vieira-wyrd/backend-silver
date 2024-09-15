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

      const result = await service.createTask(taskData, null);
      expect(result).toEqual(mockTask);
      expect(mockPrismaService.task.create).toHaveBeenCalledWith({ data: taskData });
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
    it('should return tasks grouped by project name', async () => {
      const mockTasks: Task[] = [
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
        },
        {
          id: 2,
          title: 'Task 2',
          project: 'Project 2',
          status: TaskStatus.DOING,
          description: '',
          priority: 1,
          deadline: null,
          list: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 3,
          title: 'Task 3',
          project: 'Project 1',
          status: TaskStatus.DONE,
          description: '',
          priority: 2,
          deadline: null,
          list: '',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockPrismaService.task.findMany.mockResolvedValue(mockTasks);

      const result = await service.getUserProjects();
      expect(result).toEqual({
        'Project 1': [mockTasks[0], mockTasks[2]],
        'Project 2': [mockTasks[1]],
      });
      expect(mockPrismaService.task.findMany).toHaveBeenCalledWith({
        take: 100,
        orderBy: {
          createdAt: 'desc',
        },
      });
    });
  });
});
