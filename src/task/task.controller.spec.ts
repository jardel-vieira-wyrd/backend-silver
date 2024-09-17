import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task, TaskStatus, PermissionLevel } from '@prisma/client';
import { AuthUser } from '../auth/get-user.decorator';

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
    createTaskPermission: jest.fn(),
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

      const mockUser: AuthUser = { userId: 1, email: 'test@example.com' };
      const result = await controller.createTask(taskData, mockUser);
      expect(result).toEqual(mockTask);
      expect(mockTaskService.createTask).toHaveBeenCalledWith(taskData, mockUser.userId);
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
    it('should return projects grouped by name with tasks and permissions', async () => {
      const mockUser: AuthUser = { userId: 1, email: 'test@example.com' };
      const mockProjectsWithTasks = {
        'Project 1': [{
          id: 1,
          title: 'Task 1',
          project: 'Project 1',
          userPermissions: [
            { userId: 1, email: 'test@example.com', role: PermissionLevel.OWNER },
            { userId: 2, email: 'user2@example.com', role: PermissionLevel.EXECUTOR }
          ]
        }],
        'Project 2': [{
          id: 2,
          title: 'Task 2',
          project: 'Project 2',
          userPermissions: [
            { userId: 1, email: 'test@example.com', role: PermissionLevel.STAKEHOLDER }
          ]
        }]
      };
      mockTaskService.getUserProjects.mockResolvedValue(mockProjectsWithTasks);

      const groupBy = 'project';
      const result = await controller.getProjects(mockUser, groupBy);
      expect(result).toEqual(mockProjectsWithTasks);
      expect(mockTaskService.getUserProjects).toHaveBeenCalledWith(mockUser.userId, groupBy);
    });

    it('should call getUserProjects with undefined groupBy when not provided', async () => {
      const mockUser: AuthUser = { userId: 1, email: 'test@example.com' };
      const mockProjectsWithTasks = { /* ... */ };
      mockTaskService.getUserProjects.mockResolvedValue(mockProjectsWithTasks);

      await controller.getProjects(mockUser);
      expect(mockTaskService.getUserProjects).toHaveBeenCalledWith(mockUser.userId, undefined);
    });
  });

  describe('createTaskPermission', () => {
    it('should create a new task permission', async () => {
      const createPermissionDto = {
        userId: 1,
        taskId: 1,
        role: PermissionLevel.EXECUTOR
      };

      mockTaskService.createTaskPermission.mockResolvedValue(undefined);

      await controller.createTaskPermission(createPermissionDto);

      expect(mockTaskService.createTaskPermission).toHaveBeenCalledWith(
        createPermissionDto.userId,
        createPermissionDto.taskId,
        createPermissionDto.role
      );
    });
  });
});
