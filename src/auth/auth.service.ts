import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.user({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      user: {
        name: user.name,
        email: user.email,
        id: user.id,
      },
      token: this.jwtService.sign(payload),
    };
  }

  async register(userData: { name: string; email: string; password: string }) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.userService.createUser({
      ...userData,
      password: hashedPassword,
    });
    const { password, ...result } = user;
    return {
      user: {
        name: result.name,
        email: result.email,
      },
      token: this.jwtService.sign({ email: result.email, sub: result.id }),
    };
  }
}
