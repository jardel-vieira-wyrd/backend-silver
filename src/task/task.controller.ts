import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task as TaskModel, TaskStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('projects')
  async getUserProjects(@GetUser() user: { userId: number; email: string }): Promise<string[]> {
    console.log('getUserProjects', user.userId);
    return this.taskService.getUserProjects(user.userId);
  }

  @Get()
  async getTasks(@GetUser() user: { userId: number; email: string }): Promise<TaskModel[]> {
    console.log('getTasks', user.userId);
    return this.taskService.tasks(user.userId);
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string, @GetUser() user: { userId: number; email: string }): Promise<TaskModel> {
    console.log('getTaskById', id, user.userId);
    return this.taskService.task({ id: parseInt(id, 10) }, user.userId);
  }

  @Post()
  async createTask(
    @GetUser() user: { userId: number; email: string },
    @Body() taskData: { title: string; project: string },
  ): Promise<TaskModel> {
    return this.taskService.createTask({
      ...taskData,
      createdBy: { connect: { id: user.userId } },
    });
  }

  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() taskData: { title?: string; project?: string; status?: string },
    @GetUser() user: { userId: number; email: string },
  ): Promise<TaskModel> {
    return this.taskService.updateTask({
      where: { id: Number(id) },
      data: {
        title: taskData.title,
        project: taskData.project,
        status: taskData.status as TaskStatus,
      },
    }, user.userId);
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string, @GetUser() user: { userId: number; email: string }): Promise<TaskModel> {
    return this.taskService.deleteTask({ id: Number(id) }, user.userId);
  }
}
