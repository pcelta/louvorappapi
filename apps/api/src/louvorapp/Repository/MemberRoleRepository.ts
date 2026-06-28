import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './AbstractRepository';
import { MemberRole } from '../Entity/MemberRole';

@Injectable()
export class MemberRoleRepository extends AbstractRepository {
  public async persist(memberRole: MemberRole): Promise<void> {
    delete memberRole['id'];
    await this.em.persist(memberRole).flush();
  }

  public async deleteByMember(memberId: number): Promise<void> {
    await this.em.nativeDelete(MemberRole, { member: memberId });
  }
}
