
import { EntityManager } from '@mikro-orm/postgresql';
import { Inject } from '@nestjs/common';

export abstract class AbstractRepository {
  constructor(@Inject(EntityManager) protected em: EntityManager) {}
}
