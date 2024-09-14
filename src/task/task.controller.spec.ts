import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task, TaskStatus } from '@prisma/client';

describe('TaskController', () => {
  let controller: TaskController;
  let service: TaskService;

  const mockTaskService = {
    tasks: jest.fn(),
    task: jest.fn(),
    createTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
    getUserProjects: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
      providers: [{ provide: TaskService, useValue: mockTaskService }],
    }).compile();

    controller = module.get<TaskController>(TaskController);
    service = module.get<TaskService>(TaskService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTasks', () => {
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
      mockTaskService.tasks.mockResolvedValue(mockTasks);

      const result = await controller.getTasks({ userId: 1, email: 'test@example.com' });
      expect(result).toEqual(mockTasks);
      expect(mockTaskService.tasks).toHaveBeenCalledWith(1);
    });
  });

  describe('getTaskById', () => {
    it('should return a single task', async () => {
      const mockTask: Task = {
        id: 1, title: 'Test Task', project: 'Test Project', status: TaskStatus.TO_DO, createdById: 1, assignedTo: [], readableBy: [], editableBy: [], updatableBy: [], createdAt: new Date(), updatedAt: new Date(),
        description: '',
        priority: 0,
        deadline: undefined,
        list: ''
      };
      mockTaskService.task.mockResolvedValue(mockTask);

      const result = await controller.getTaskById('1', { userId: 1, email: 'test@example.com' });
      expect(result).toEqual(mockTask);
      expect(mockTaskService.task).toHaveBeenCalledWith({ id: 1 }, 1);
    });
  });

  // Add more tests for createTask, updateTask, deleteTask, and getUserProjects methods
});
