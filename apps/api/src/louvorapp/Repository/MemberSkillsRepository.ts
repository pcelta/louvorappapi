import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './AbstractRepository';
import { MemberSkills } from '../Entity/MemberSkills';

@Injectable()
export class MemberSkillsRepository extends AbstractRepository {
  public async deleteByMember(memberId: number): Promise<void> {
    await this.em.nativeDelete(MemberSkills, { member: memberId });
  }

  public async persistMany(items: MemberSkills[]): Promise<void> {
    for (const item of items) {
      delete item['id'];
      this.em.persist(item);
    }

    await this.em.flush();
  }
}