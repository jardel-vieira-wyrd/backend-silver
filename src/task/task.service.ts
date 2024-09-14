import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task, Prisma, User } from '@prisma/client';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) {}

  async tasks(userId: number): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: {
        OR: [
          { createdById: userId },
          { updatableBy: { has: userId } },
          { readableBy: { has: userId } }
        ]
      }
    });
  }

  async task(taskWhereUniqueInput: Prisma.TaskWhereUniqueInput, userId: number): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({
      where: taskWhereUniqueInput,
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.createdById !== userId && !task.updatableBy.includes(userId) && !task.readableBy.includes(userId)) {
      throw new ForbiddenException('You do not have permission to view this task');
    }

    return task;
  }

  async createTask(data: Prisma.TaskCreateInput): Promise<Task> {
    return this.prisma.task.create({
      data: {
        ...data,
        assignedTo: data.assignedTo ? { set: data.assignedTo as number[] } : undefined,
        readableBy: data.readableBy ? { set: data.readableBy as number[] } : undefined,
        editableBy: data.editableBy ? { set: data.editableBy as number[] } : undefined,
        updatableBy: data.updatableBy ? { set: data.updatableBy as number[] } : undefined,
      },
    });
  }

  async updateTask(params: { where: Prisma.TaskWhereUniqueInput; data: Prisma.TaskUpdateInput }, userId: number): Promise<Task> {
    const { where, data } = params;
    const task = await this.prisma.task.findUnique({ where });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.createdById !== userId && !task.updatableBy.includes(userId)) {
      throw new ForbiddenException('You do not have permission to update this task');
    }

    return this.prisma.task.update({
      where,
      data: {
        ...data,
        assignedTo: data.assignedTo ? { set: data.assignedTo as number[] } : undefined,
        readableBy: data.readableBy ? { set: data.readableBy as number[] } : undefined,
        editableBy: data.editableBy ? { set: data.editableBy as number[] } : undefined,
        updatableBy: data.updatableBy ? { set: data.updatableBy as number[] } : undefined,
      },
    });
  }

  async deleteTask(where: Prisma.TaskWhereUniqueInput, userId: number): Promise<Task> {
    const task = await this.prisma.task.findUnique({ where });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    if (task.createdById !== userId) {
      throw new ForbiddenException('You do not have permission to delete this task');
    }

    return this.prisma.task.delete({ where });
  }

  async getUserProjects(userId: number): Promise<string[]> {
    console.log('getUserProjects', userId);
    const tasks = await this.prisma.task.findMany({
      where: {
        OR: [
          { createdById: userId },
          { updatableBy: { has: userId } },
          { readableBy: { has: userId } }
        ]
      },
      select: {
        project: true
      },
      distinct: ['project']
    });

    return tasks.map(task => task.project);
  }
}
