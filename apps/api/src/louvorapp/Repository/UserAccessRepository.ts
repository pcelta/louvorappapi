import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './AbstractRepository';
import UserAccess from '../Entity/UserAccess';

@Injectable()
export default class UserAccessRepository extends AbstractRepository {
  public async persist(userAccess: UserAccess) {
    delete userAccess['id'];
    this.em.persist(userAccess).flush();
  }
}
