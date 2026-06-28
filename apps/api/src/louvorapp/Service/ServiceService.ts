import { Injectable, NotFoundException } from '@nestjs/common';
import UidManager from '../Util/UidManager';
import { ServiceRepository } from '../Repository/ServiceRepository';
import { ServicePastorRepository } from '../Repository/ServicePastorRepository';
import { MemberRepository } from '../Repository/MemberRepository';
import Service from '../Entity/Service';
import { ServicePastor } from '../Entity/ServicePastor';
import ServiceCreationDTO from '../DTO/ServiceCreationDTO';
import Church from '../Entity/Church';

@Injectable()
export class ServiceService {
  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly servicePastorRepository: ServicePastorRepository,
    private readonly memberRepository: MemberRepository,
  ) {}

  public async listByChurch(church: Church): Promise<Service[]> {
    return await this.serviceRepository.findByChurch(church.id);
  }

  public async getByUid(uid: string, church: Church): Promise<Service> {
    return await this.serviceRepository.findByUidAndChurch(uid, church.id);
  }

  public async create(dto: ServiceCreationDTO, church: Church): Promise<Service> {
    const service = new Service();
    service.uid = UidManager.generate('service');
    service.church = church;
    service.createdAt = new Date();
    service.updatedAt = new Date();
    this.applyFields(service, dto);

    await this.serviceRepository.persist(service);
    await this.setPastors(service, church, dto.pastorUids ?? []);

    return await this.serviceRepository.findByUidAndChurch(service.uid, church.id);
  }

  public async update(
    uid: string,
    church: Church,
    dto: ServiceCreationDTO,
  ): Promise<Service> {
    const service = await this.serviceRepository.findByUidAndChurch(
      uid,
      church.id,
    );
    if (!service) {
      throw new NotFoundException('Culto não encontrado');
    }

    this.applyFields(service, dto);

    await this.serviceRepository.flush();
    await this.setPastors(service, church, dto.pastorUids ?? []);

    return await this.serviceRepository.findByUidAndChurch(uid, church.id);
  }

  private applyFields(service: Service, dto: ServiceCreationDTO): void {
    service.scheduledAt = new Date(dto.scheduledAt);
    service.subtitle = dto.subtitle;
    service.notes = dto.notes;
    service.isSupper = dto.isSupper ?? false;
    service.title =
      dto.title && dto.title.trim()
        ? dto.title.trim()
        : this.defaultTitle(service.scheduledAt);
  }

  private defaultTitle(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');

    return `Culto ${day}/${month}/${date.getFullYear()}`;
  }

  private async setPastors(
    service: Service,
    church: Church,
    pastorUids: string[],
  ): Promise<void> {
    await this.servicePastorRepository.deleteByService(service.id);

    if (!pastorUids.length) {
      return;
    }

    const members = await this.memberRepository.findByUidsAndChurch(
      pastorUids,
      church.id,
    );

    const items = members.map((member) => {
      const servicePastor = new ServicePastor();
      servicePastor.service = service;
      servicePastor.member = member;
      servicePastor.createdAt = new Date();
      servicePastor.updatedAt = new Date();

      return servicePastor;
    });

    await this.servicePastorRepository.persistMany(items);
  }
}