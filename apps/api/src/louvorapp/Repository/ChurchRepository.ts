import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './AbstractRepository';
import Church from '../Entity/Church';

@Injectable()
export default class ChurchRepository extends AbstractRepository {
  public async persist(church: Church): Promise<void> {
    delete church['id'];

    await this.em.persist(church).flush();
  }
}
