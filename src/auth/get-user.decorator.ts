import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface AuthUser {
  userId: number;
  email: string;
}

export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AuthUser => {
    const request = ctx.switchToHttp().getRequest();
    console.log('GetUser decorator - request.user:', request.user);
    return request.user;
  },
);
