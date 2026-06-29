import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './AbstractRepository';
import Service from '../Entity/Service';

@Injectable()
export class ServiceRepository extends AbstractRepository {
  private static POPULATE = [
    'pastors',
    'pastors.member',
    'pastors.member.user',
    'worships',
    'worships.roster',
    'worships.roster.member',
    'worships.roster.member.user',
  ] as const;

  public async persist(service: Service): Promise<void> {
    delete service['id'];
    await this.em.persist(service).flush();
  }

  public async flush(): Promise<void> {
    await this.em.flush();
  }

  public async findByChurch(churchId: number): Promise<Service[]> {
    return await this.em.find(
      Service,
      { church: churchId },
      {
        populate: [...ServiceRepository.POPULATE],
        orderBy: { scheduledAt: 'desc' },
      },
    );
  }

  public async findByUidAndChurch(
    uid: string,
    churchId: number,
  ): Promise<Service> {
    return await this.em.findOne(
      Service,
      { uid, church: churchId },
      { populate: [...ServiceRepository.POPULATE] },
    );
  }
}