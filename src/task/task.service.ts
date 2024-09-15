import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task, Prisma, PermissionLevel } from '@prisma/client';

interface TaskWithPermissions extends Task {
  taskPermissions: {
    id: number;
    userId: number;
    taskId: number;
    role: PermissionLevel;
    createdAt: Date;
    updatedAt: Date;
    user: {
      id: number;
      email: string;
      name: string; // Added name
    };
  }[];
  userPermissions: {
    userId: number;
    email: string;
    name: string; // Added name
    role: PermissionLevel;
  }[];
}

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async tasks(): Promise<Task[]> {
    return this.prisma.task.findMany();
  }

  async task(taskWhereUniqueInput: Prisma.TaskWhereUniqueInput): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({
      where: taskWhereUniqueInput,
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  async createTask(data: Prisma.TaskCreateInput, userId: number): Promise<Task> {
    const task = await this.prisma.task.create({
      data,
    });
    // Create permission for the task creator
    await this.prisma.taskPermission.create({
      data: {
        user: {
          connect: { id: userId }
        },
        task: {
          connect: { id: task.id }
        },
        role: 'OWNER',
      },
    });

    return task;
  }

  async updateTask(params: { where: Prisma.TaskWhereUniqueInput; data: Prisma.TaskUpdateInput }): Promise<Task> {
    const { where, data } = params;
    const task = await this.prisma.task.findUnique({ where });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.prisma.task.update({
      where,
      data,
    });
  }

  async deleteTask(where: Prisma.TaskWhereUniqueInput): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return this.prisma.task.delete({ where });
  }

  async getUserProjects(userId: number): Promise<{ [project: string]: TaskWithPermissions[] }> {
    const tasks = await this.prisma.task.findMany({
      where: {
        taskPermissions: {
          some: {
            userId: userId
          }
        }
      },
      include: {
        taskPermissions: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
                name: true // Added name
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 100
    });

    const tasksWithPermissions: TaskWithPermissions[] = tasks.map(task => ({
      ...task,
      userPermissions: task.taskPermissions.map(permission => ({
        userId: permission.user.id,
        email: permission.user.email,
        name: permission.user.name, // Added name
        role: permission.role
      }))
    }));

    const groupedTasks = tasksWithPermissions.reduce((acc, task) => {
      if (!acc[task.project]) {
        acc[task.project] = [];
      }
      acc[task.project].push(task);
      return acc;
    }, {} as { [project: string]: TaskWithPermissions[] });

    return groupedTasks;
  }

  async createTaskPermission(userId: number, taskId: number, role: PermissionLevel): Promise<void> {
    // Check if the task exists
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new NotFoundException('Task not found');
    }

    // Check if the user exists
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if the permission already exists
    const existingPermission = await this.prisma.taskPermission.findUnique({
      where: {
        userId_taskId: {
          userId: userId,
          taskId: taskId
        }
      }
    });

    if (existingPermission) {
      throw new ConflictException('Permission already exists for this user on this task');
    }

    // Create the new permission
    await this.prisma.taskPermission.create({
      data: {
        userId: userId,
        taskId: taskId,
        role: role
      }
    });
  }
}
