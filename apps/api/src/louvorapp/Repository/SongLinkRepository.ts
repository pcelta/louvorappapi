import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './AbstractRepository';
import { SongLink } from '../Entity/SongLink';

@Injectable()
export class SongLinkRepository extends AbstractRepository {
  public async deleteBySong(songId: number): Promise<void> {
    await this.em.nativeDelete(SongLink, { song: songId });
  }

  public async persistMany(links: SongLink[]): Promise<void> {
    for (const link of links) {
      delete link['id'];
      this.em.persist(link);
    }

    await this.em.flush();
  }
}