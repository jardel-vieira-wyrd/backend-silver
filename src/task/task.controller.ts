import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { Task as TaskModel, TaskStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('projects')
  async getProjects(): Promise<string[]> {
    return this.taskService.getUserProjects();
  }

  @Get()
  async getTasks(): Promise<TaskModel[]> {
    return this.taskService.tasks();
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string): Promise<TaskModel> {
    return this.taskService.task({ id: parseInt(id, 10) });
  }

  @Post()
  async createTask(
    @Body() taskData: { 
      title: string; 
      project: string; 
      description?: string;
      status?: TaskStatus;
      priority?: number;
      deadline?: Date;
      list?: string;
    },
  ): Promise<TaskModel> {
    return this.taskService.createTask(taskData);
  }

  @Put(':id')
  async updateTask(
    @Param('id') id: string,
    @Body() taskData: { 
      title?: string; 
      project?: string; 
      description?: string;
      status?: TaskStatus;
      priority?: number;
      deadline?: Date;
      list?: string;
    },
  ): Promise<TaskModel> {
    return this.taskService.updateTask({
      where: { id: Number(id) },
      data: taskData,
    });
  }

  @Delete(':id')
  async deleteTask(@Param('id') id: string): Promise<TaskModel> {
    return this.taskService.deleteTask({ id: Number(id) });
  }
}
