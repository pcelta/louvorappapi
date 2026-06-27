import { Injectable } from '@nestjs/common';
import { AbstractRepository } from './AbstractRepository';
import { Skill } from '../Entity/Skill';

@Injectable()
export class SkillRepository extends AbstractRepository {
  public async findAll(): Promise<Skill[]> {
    return await this.em.find(Skill, {}, { orderBy: { name: 'asc' } });
  }

  public async findBySlugs(slugs: string[]): Promise<Skill[]> {
    if (!slugs.length) {
      return [];
    }

    return await this.em.find(Skill, { slug: { $in: slugs } });
  }
}