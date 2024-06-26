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

  public async findByEmail(email: string): Promise<User> {
    const queryBuilder = this.em.createQueryBuilder(User);
    const user = await queryBuilder.select(['*'], true)
      .where({ 'email': email })
      .getSingleResult();

    return user;
  }

  public async findByUserUidAndAccessToken(uid: string, accessToken: string): Promise<User> {
    const queryBuilder = this.em.createQueryBuilder(User, 'u');
    const user = await queryBuilder.select(['u.*'], true)
      .join('u.access', 'ua')
      .where({ 'u.uid': uid, 'ua.access_token':  accessToken })
      .getSingleResult();

    return user;
  }
}
