import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { TaskService } from './task.service';
import { Prisma, Task as TaskModel, TaskStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { AuthUser } from '../auth/get-user.decorator';
import { PermissionLevel } from '@prisma/client';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('projects')
  async getProjects(@GetUser() user: AuthUser): Promise<{ [project: string]: TaskModel[] }> {
    return this.taskService.getUserProjects(user.userId);
  }

  @Get(':id')
  async getTaskById(@Param('id') id: string): Promise<TaskModel> {
    return this.taskService.task({ id: parseInt(id, 10) });
  }

  @Post()
  async createTask(
    @Body() taskData: Prisma.TaskCreateInput,
    @GetUser() user: AuthUser
  ): Promise<TaskModel> {
    return this.taskService.createTask(taskData, user.userId);
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

  @Post('permissions')
  async createTaskPermission(
    @Body() createPermissionDto: { userId: number; taskId: number; role: PermissionLevel }
  ): Promise<void> {
    const { userId, taskId, role } = createPermissionDto;
    await this.taskService.createTaskPermission(userId, taskId, role);
  }
}
