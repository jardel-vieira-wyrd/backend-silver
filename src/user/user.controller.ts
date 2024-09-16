import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User as UserModel } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(
    @Body() userData: { name?: string; email: string; password: string },
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }

  @Get()
  async getAllUsers() {
    return this.userService.findAllUsers();
  }

  @Get(':id')
  async getUserById(@Param('id') id: string): Promise<UserModel> {
    return this.userService.user({ id: Number(id) });
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() userData: { name?: string; email?: string; password?: string },
  ): Promise<UserModel> {
    return this.userService.updateUser({
      where: { id: Number(id) },
      data: userData,
    });
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string): Promise<UserModel> {
    return this.userService.deleteUser({ id: Number(id) });
  }
}
