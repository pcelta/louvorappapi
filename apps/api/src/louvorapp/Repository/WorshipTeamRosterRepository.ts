import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './AbstractRepository';
import { WorshipTeamRoster } from '../Entity/WorshipTeamRoster';

@Injectable()
export class WorshipTeamRosterRepository extends AbstractRepository {
  public async deleteByWorship(worshipId: number): Promise<void> {
    await this.em.nativeDelete(WorshipTeamRoster, { worship: worshipId });
  }

  public async persistMany(items: WorshipTeamRoster[]): Promise<void> {
    for (const item of items) {
      delete item['id'];
      this.em.persist(item);
    }

    await this.em.flush();
  }
}