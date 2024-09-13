import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from '../prisma/prisma.service';
import { User, Prisma } from '@prisma/client';
import { ConflictException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let prismaService: PrismaService;

  const mockUser: User = {
    id: 1,
    email: 'test@example.com',
    name: 'Test User',
    password: 'hashedpassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('user', () => {
    it('should return a single user', async () => {
      prismaService.user.findUnique = jest.fn().mockResolvedValue(mockUser);
      const result = await service.user({ id: 1 });
      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('users', () => {
    it('should return an array of users', async () => {
      prismaService.user.findMany = jest.fn().mockResolvedValue([mockUser]);
      const result = await service.users({});
      expect(result).toEqual([mockUser]);
      expect(prismaService.user.findMany).toHaveBeenCalled();
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const newUser: Prisma.UserCreateInput = {
        email: 'new@example.com',
        name: 'New User',
        password: 'newpassword',
      };
      prismaService.user.create = jest.fn().mockResolvedValue({ ...mockUser, ...newUser });
      const result = await service.createUser(newUser);
      expect(result).toEqual({ ...mockUser, ...newUser });
      expect(prismaService.user.create).toHaveBeenCalledWith({ data: newUser });
    });

    it('should throw ConflictException if email already exists', async () => {
      const newUser: Prisma.UserCreateInput = {
        email: 'existing@example.com',
        name: 'New User',
        password: 'newpassword',
      };
      prismaService.user.create = jest.fn().mockRejectedValue({
        code: 'P2002',
        meta: { target: ['email'] },
      });
      await expect(service.createUser(newUser)).rejects.toThrow(ConflictException);
      await expect(service.createUser(newUser)).rejects.toThrow('Email already exists');
    });
  });

  describe('updateUser', () => {
    it('should update an existing user', async () => {
      const updateData: Prisma.UserUpdateInput = { name: 'Updated Name' };
      prismaService.user.update = jest.fn().mockResolvedValue({ ...mockUser, ...updateData });
      const result = await service.updateUser({ where: { id: 1 }, data: updateData });
      expect(result).toEqual({ ...mockUser, ...updateData });
      expect(prismaService.user.update).toHaveBeenCalledWith({ where: { id: 1 }, data: updateData });
    });

    it('should throw ConflictException if updated email already exists', async () => {
      const updateData: Prisma.UserUpdateInput = { email: 'existing@example.com' };
      prismaService.user.update = jest.fn().mockRejectedValue({
        code: 'P2002',
        meta: { target: ['email'] },
      });
      await expect(service.updateUser({ where: { id: 1 }, data: updateData })).rejects.toThrow(ConflictException);
      await expect(service.updateUser({ where: { id: 1 }, data: updateData })).rejects.toThrow('Email already exists');
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', async () => {
      prismaService.user.delete = jest.fn().mockResolvedValue(mockUser);
      const result = await service.deleteUser({ id: 1 });
      expect(result).toEqual(mockUser);
      expect(prismaService.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });
});
