import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './AbstractRepository';
import { ServicePastor } from '../Entity/ServicePastor';

@Injectable()
export class ServicePastorRepository extends AbstractRepository {
  public async deleteByService(serviceId: number): Promise<void> {
    await this.em.nativeDelete(ServicePastor, { service: serviceId });
  }

  public async persistMany(items: ServicePastor[]): Promise<void> {
    for (const item of items) {
      delete item['id'];
      this.em.persist(item);
    }

    await this.em.flush();
  }
}