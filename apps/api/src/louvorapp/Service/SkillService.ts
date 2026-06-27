import { Injectable } from '@nestjs/common';
import { SkillRepository } from '../Repository/SkillRepository';
import { Skill } from '../Entity/Skill';

@Injectable()
export class SkillService {
  constructor(private readonly skillRepository: SkillRepository) {}

  public async listAll(): Promise<Skill[]> {
    return await this.skillRepository.findAll();
  }

  public async getBySlugs(slugs: string[]): Promise<Skill[]> {
    return await this.skillRepository.findBySlugs(slugs);
  }
}