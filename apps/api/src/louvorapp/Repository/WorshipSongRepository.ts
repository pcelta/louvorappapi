import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './AbstractRepository';
import { WorshipSong } from '../Entity/WorshipSong';

@Injectable()
export class WorshipSongRepository extends AbstractRepository {
  public async deleteByWorship(worshipId: number): Promise<void> {
    await this.em.nativeDelete(WorshipSong, { worship: worshipId });
  }

  public async persistMany(items: WorshipSong[]): Promise<void> {
    for (const item of items) {
      delete item['id'];
      this.em.persist(item);
    }

    await this.em.flush();
  }
}