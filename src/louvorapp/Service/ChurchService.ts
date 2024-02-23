import { Injectable } from '@nestjs/common';
import UidManager from '../Util/UidManager';
import ChurchCreationDTO from '../DTO/ChurchCreationDTO';
import Church from '../Entity/Church';
import ChurchRepository from '../Repository/ChurchRepository';
import User from '../Entity/User';
import { MemberService } from './MemberService';

@Injectable()
export class ChurchService {
  constructor(private readonly churchRepository: ChurchRepository, private memberService: MemberService) {}

  public async createFromCreationDto(churchCreationDto: ChurchCreationDTO, creator: User): Promise<Church> {

    const uid = UidManager.generate('church');
    let church = new Church();
    church.name = churchCreationDto.name;
    church.logoPath = '/some-path-to-some-bucket';
    church.uid = uid;
    church.updatedAt = new Date();
    church.createdAt = new Date();

    await this.churchRepository.persist(church);
    await this.memberService.createAdmin(creator, church);

    return church;
  }
}
