import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './AbstractRepository';
import { Song } from '../Entity/Song';

@Injectable()
export class SongRepository extends AbstractRepository {
  public async persist(song: Song): Promise<void> {
    delete song['id'];
    await this.em.persist(song).flush();
  }

  public async flush(): Promise<void> {
    await this.em.flush();
  }

  public async findByChurch(churchId: number): Promise<Song[]> {
    return await this.em.find(
      Song,
      { church: churchId },
      { populate: ['artist', 'links'], orderBy: { title: 'asc' } },
    );
  }

  public async findByUidAndChurch(
    uid: string,
    churchId: number,
  ): Promise<Song> {
    return await this.em.findOne(
      Song,
      { uid, church: churchId },
      { populate: ['artist', 'links'] },
    );
  }
}