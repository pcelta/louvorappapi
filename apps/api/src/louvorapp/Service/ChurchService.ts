import { ConflictException, Injectable } from '@nestjs/common';
import UidManager from '../Util/UidManager';
import ChurchCreationDTO from '../DTO/ChurchCreationDTO';
import Church from '../Entity/Church';
import ChurchRepository from '../Repository/ChurchRepository';
import { MemberService } from './MemberService';
import UserService from './UserService';

@Injectable()
export class ChurchService {
  constructor(
    private readonly churchRepository: ChurchRepository,
    private memberService: MemberService,
    private userService: UserService,
  ) {}

  public async createFromCreationDto(
    churchCreationDto: ChurchCreationDTO,
  ): Promise<Church> {
    for (const member of churchCreationDto.members) {
      const existing = await this.userService.getByEmail(member.user.email);
      if (existing !== null) {
        throw new ConflictException(
          `Email ${member.user.email} is already in use`,
        );
      }
    }

    let church = new Church();
    church.name = churchCreationDto.name;
    church.logoPath = '/some-path-to-some-bucket';
    church.uid = UidManager.generate('church');
    church.updatedAt = new Date();
    church.createdAt = new Date();

    await this.churchRepository.persist(church);

    for (const member of churchCreationDto.members) {
      const user = await this.userService.createFromCreationDto(member.user);
      await this.memberService.createAdmin(user, church);
    }

    return church;
  }
}