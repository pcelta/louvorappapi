import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './AbstractRepository';
import { User } from '@prisma/client';

@Injectable()
export default class UserRepository extends AbstractRepository {
  public async persist(user: User): Promise<User> {
    delete user['id'];

    const justCreatedUser = await this.prismaClient.user.create({ data: { ...user } });

    return justCreatedUser;
  }
}
