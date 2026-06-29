import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './AbstractRepository';
import { Worship } from '../Entity/Worship';

@Injectable()
export class WorshipRepository extends AbstractRepository {
  private static POPULATE = [
    'service',
    'songs',
    'songs.song',
    'songs.song.artist',
    'roster',
    'roster.member',
    'roster.member.user',
  ] as const;

  public async persist(worship: Worship): Promise<void> {
    delete worship['id'];
    await this.em.persist(worship).flush();
  }

  public async flush(): Promise<void> {
    await this.em.flush();
  }

  public async findByChurch(churchId: number): Promise<Worship[]> {
    return await this.em.find(
      Worship,
      { service: { church: churchId } },
      {
        populate: [...WorshipRepository.POPULATE],
        orderBy: { createdAt: 'desc' },
      },
    );
  }

  public async findByUidAndChurch(
    uid: string,
    churchId: number,
  ): Promise<Worship> {
    return await this.em.findOne(
      Worship,
      { uid, service: { church: churchId } },
      { populate: [...WorshipRepository.POPULATE] },
    );
  }
}