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
      mockTaskService.tasks.mockResolvedValue(mockTasks);

      const result = await controller.getTasks();
      expect(result).toEqual(mockTasks);
      expect(mockTaskService.tasks).toHaveBeenCalled();
    });
  });

  describe('getTaskById', () => {
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
      mockTaskService.task.mockResolvedValue(mockTask);

      const result = await controller.getTaskById('1');
      expect(result).toEqual(mockTask);
      expect(mockTaskService.task).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('createTask', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'New Task',
        project: 'New Project',
        description: 'Task description',
        status: TaskStatus.TO_DO,
        priority: 1,
        deadline: new Date(),
        list: 'To-Do List',
      };
      const mockTask: Task = { ...taskData, id: 1, createdAt: new Date(), updatedAt: new Date() };
      mockTaskService.createTask.mockResolvedValue(mockTask);

      const result = await controller.createTask(taskData);
      expect(result).toEqual(mockTask);
      expect(mockTaskService.createTask).toHaveBeenCalledWith(taskData);
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
      mockTaskService.updateTask.mockResolvedValue(mockTask);

      const result = await controller.updateTask('1', taskData);
      expect(result).toEqual(mockTask);
      expect(mockTaskService.updateTask).toHaveBeenCalledWith({
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
      mockTaskService.deleteTask.mockResolvedValue(mockTask);

      const result = await controller.deleteTask('1');
      expect(result).toEqual(mockTask);
      expect(mockTaskService.deleteTask).toHaveBeenCalledWith({ id: 1 });
    });
  });

  describe('getProjects', () => {
    it('should return an array of project names', async () => {
      const mockProjects = ['Project 1', 'Project 2'];
      mockTaskService.getUserProjects.mockResolvedValue(mockProjects);

      const result = await controller.getProjects();
      expect(result).toEqual(mockProjects);
      expect(mockTaskService.getUserProjects).toHaveBeenCalled();
    });
  });
});
