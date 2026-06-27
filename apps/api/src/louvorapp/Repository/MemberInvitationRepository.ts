import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './AbstractRepository';
import { MemberInvitation } from '../Entity/MemberInvitation';

@Injectable()
export class MemberInvitationRepository extends AbstractRepository {
  public async persist(invitation: MemberInvitation): Promise<void> {
    delete invitation['id'];
    await this.em.persist(invitation).flush();
  }

  public async findByCode(code: string): Promise<MemberInvitation> {
    return await this.em.findOne(
      MemberInvitation,
      { code },
      {
        populate: [
          'member',
          'member.user',
          'member.church',
          'member.memberSkills',
          'member.memberSkills.skill',
        ],
      },
    );
  }

  public async flush(): Promise<void> {
    await this.em.flush();
  }
}