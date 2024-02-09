import { Inject } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

export abstract class AbstractRepository {
  constructor(@Inject('PrismaClient') protected prismaClient: PrismaClient) {}
}
