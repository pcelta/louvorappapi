import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './AbstractRepository';
import User from '../Entity/User';

@Injectable()
export default class UserRepository extends AbstractRepository {
  public async persist(user: User): Promise<User> {
    delete user['id'];
    this.em.persist(user).flush();

    return null
  }
}
