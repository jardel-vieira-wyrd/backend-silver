import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { TaskService } from './task.service';
import { Prisma, Task as TaskModel, TaskStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator';
import { AuthUser } from '../auth/get-user.decorator';
import { PermissionLevel } from '@prisma/client';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('tasks')
@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Get('projects')
  @ApiOperation({ summary: 'Get user projects' })
  @ApiResponse({ status: 200, description: 'Return user projects' })
  @ApiQuery({ name: 'groupByUser', required: false, type: Boolean })
  async getProjects(
    @GetUser() user: AuthUser,
    @Query('groupBy') groupBy?: string
  ): Promise<{ [key: string]: TaskModel[] }> {
    return this.taskService.getUserProjects(user.userId, groupBy);
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
    console.log(createPermissionDto);
    const { userId, taskId, role } = createPermissionDto;
    await this.taskService.createTaskPermission(userId, taskId, role);
  }
}
