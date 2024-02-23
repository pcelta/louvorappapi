import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ExtractJwtData = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    return token;
  }
);
