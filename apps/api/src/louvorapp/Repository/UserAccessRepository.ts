import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './AbstractRepository';
import UserAccess from '../Entity/UserAccess';
import User from '../Entity/User';

@Injectable()
export default class UserAccessRepository extends AbstractRepository {
  public async persist(userAccess: UserAccess) {
    delete userAccess['id'];
    await this.em.persist(userAccess).flush();
  }

  public async deleteByUser(user: User): Promise<void> {
    await this.em.nativeDelete(UserAccess, { user: user.id });
  }
}
