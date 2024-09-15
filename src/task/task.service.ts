import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Task, Prisma } from '@prisma/client';

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

  async createTask(data: Prisma.TaskCreateInput): Promise<Task> {
    return this.prisma.task.create({
      data,
    });
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

  async getUserProjects(): Promise<string[]> {
    const tasks = await this.prisma.task.findMany({
      select: {
        project: true
      },
      distinct: ['project']
    });

    return tasks.map(task => task.project);
  }
}
