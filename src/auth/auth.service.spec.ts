import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: {
            user: jest.fn(),
            createUser: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user object when credentials are valid', async () => {
      const user = {
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('password', 10),
      };
      (userService.user as jest.Mock).mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUser('test@example.com', 'password');
      expect(result).toEqual({ id: 1, email: 'test@example.com' });
    });

    it('should return null when credentials are invalid', async () => {
      (userService.user as jest.Mock).mockResolvedValue(null);

      const result = await authService.validateUser('test@example.com', 'wrong-password');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return JWT token when credentials are valid', async () => {
      const user = { id: 1, email: 'test@example.com' };
      (jwtService.sign as jest.Mock).mockReturnValue('jwt-token');

      const result = await authService.login(user);
      expect(result).toEqual({ access_token: 'jwt-token' });
      expect(jwtService.sign).toHaveBeenCalledWith({ email: 'test@example.com', sub: 1 });
    });
  });

  describe('register', () => {
    it('should create a new user and return user data without password', async () => {
      const userData = { name: 'Test User', email: 'test@example.com', password: 'password' };
      const createdUser = { id: 1, ...userData, createdAt: new Date(), updatedAt: new Date() };
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-password');
      (userService.createUser as jest.Mock).mockResolvedValue(createdUser);

      const result = await authService.register(userData);
      expect(result).toEqual({ id: 1, name: 'Test User', email: 'test@example.com', createdAt: expect.any(Date), updatedAt: expect.any(Date) });
      expect(userService.createUser).toHaveBeenCalledWith({ ...userData, password: 'hashed-password' });
    });
  });
});
