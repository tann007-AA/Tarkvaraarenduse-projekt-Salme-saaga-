import { createParamDecorator, ExecutionContext } from '@nestjs/common';

type CurrentUser = {
  id: string;
  email: string;
};

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): CurrentUser => {
    const req = ctx.switchToHttp().getRequest<{ user: CurrentUser }>();
    return req.user;
  },
);
