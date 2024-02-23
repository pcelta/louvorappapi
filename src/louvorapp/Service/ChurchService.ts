import { Injectable } from '@nestjs/common';
import UidManager from '../Util/UidManager';
import ChurchCreationDTO from '../DTO/ChurchCreationDTO';
import Church from '../Entity/Church';
import ChurchRepository from '../Repository/ChurchRepository';

@Injectable()
export class ChurchService {
  constructor(private readonly churchRepository: ChurchRepository) {}

  public async createFromCreationDto(churchCreationDto: ChurchCreationDTO): Promise<Church> {

    const uid = UidManager.generate('church');
    let church = new Church();
    church.name = churchCreationDto.name;
    church.logoPath = '/some-path-to-some-bucket';
    church.uid = uid;
    church.updatedAt = new Date();
    church.createdAt = new Date();

    this.churchRepository.persist(church);

    return church;
  }
}
