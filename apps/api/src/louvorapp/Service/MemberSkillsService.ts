import { Injectable } from '@nestjs/common';
import { MemberSkillsRepository } from '../Repository/MemberSkillsRepository';
import { SkillService } from './SkillService';
import { MemberSkills } from '../Entity/MemberSkills';
import Member from '../Entity/Member';

@Injectable()
export class MemberSkillsService {
  constructor(
    private readonly memberSkillsRepository: MemberSkillsRepository,
    private readonly skillService: SkillService,
  ) {}

  public async setForMember(member: Member, slugs: string[]): Promise<void> {
    await this.memberSkillsRepository.deleteByMember(member.id);

    if (!slugs || slugs.length === 0) {
      return;
    }

    const skills = await this.skillService.getBySlugs(slugs);
    const items = skills.map((skill) => {
      const memberSkill = new MemberSkills();
      memberSkill.member = member;
      memberSkill.skill = skill;
      memberSkill.createdAt = new Date();
      memberSkill.updatedAt = new Date();

      return memberSkill;
    });

    await this.memberSkillsRepository.persistMany(items);
  }
}