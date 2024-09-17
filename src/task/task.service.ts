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

  async getUserProjects(userId: number, groupBy: string): Promise<{ [key: string]: TaskWithPermissions[] }> {
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
                name: true
              }
            }
          }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ],
      take: 100
    });

    const statusOrder = ['DOING', 'TO_DO', 'DONE', 'CANCELED'];

    const tasksWithPermissions: TaskWithPermissions[] = tasks.map(task => ({
      ...task,
      userPermissions: task.taskPermissions.map(permission => ({
        userId: permission.user.id,
        email: permission.user.email,
        name: permission.user.name,
        role: permission.role
      }))
    }));

    const sortedTasks = tasksWithPermissions.sort((a, b) => {
      const statusDiff = statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
      if (statusDiff !== 0) return statusDiff;
      return b.priority - a.priority;
    });

    if (groupBy === 'user') {
      const groupedByUser = sortedTasks.reduce((acc, task) => {
        task.userPermissions.forEach(userPermission => {
          const email = userPermission.email;
          if (!acc[email]) {
            acc[email] = [];
          }
          if (!acc[email].some(t => t.id === task.id)) {
            acc[email].push(task);
          }
        });
        return acc;
      }, {} as { [email: string]: TaskWithPermissions[] });

      return groupedByUser;
    } else {
      const groupedByProject = sortedTasks.reduce((acc, task) => {
        if (!acc[task.project]) {
          acc[task.project] = [];
        }
        acc[task.project].push(task);
        return acc;
      }, {} as { [project: string]: TaskWithPermissions[] });

      return groupedByProject;
    }
  }

  async createTaskPermission(userId: number, taskId: number, role: PermissionLevel | 'NONE'): Promise<void> {
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

    if (role === 'NONE') {
      // If role is 'NONE', delete the STAKEHOLDER permission if it exists
      await this.prisma.taskPermission.deleteMany({
        where: {
          userId: userId,
          taskId: taskId,
          role: PermissionLevel.STAKEHOLDER
        }
      });
      return;
    }

    // Check if the specific permission already exists
    const existingPermission = await this.prisma.taskPermission.findFirst({
      where: {
        userId: userId,
        taskId: taskId,
        role: role
      }
    });

    if (existingPermission) {
      // If the permission already exists, do nothing
      return;
    }

    // Handle based on the role
    switch (role) {
      case PermissionLevel.EXECUTOR:
        // Check if an EXECUTOR permission already exists for this task
        const existingExecutorPermission = await this.prisma.taskPermission.findFirst({
          where: {
            taskId: taskId,
            role: PermissionLevel.EXECUTOR
          }
        });

        if (existingExecutorPermission) {
          // If an EXECUTOR permission exists, update it
          await this.prisma.taskPermission.update({
            where: { id: existingExecutorPermission.id },
            data: { userId: userId }
          });
        } else {
          // If no EXECUTOR permission exists, create a new one
          await this.prisma.taskPermission.create({
            data: {
              userId: userId,
              taskId: taskId,
              role: PermissionLevel.EXECUTOR
            }
          });
        }
        break;

      default: // This will handle OWNER, STAKEHOLDER, and any other roles
        // Create the new permission
        await this.prisma.taskPermission.create({
          data: {
            userId: userId,
            taskId: taskId,
            role: role
          }
        });
        break;
    }
  }
}

