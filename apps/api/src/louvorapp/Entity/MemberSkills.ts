import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import Member from './Member';
import { Skill } from './Skill';

@Entity({ tableName: 'member_skills' })
export class MemberSkills {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ joinColumn: 'fk_member', entity: () => Member })
  member: Member;

  @ManyToOne({ joinColumn: 'fk_skill', entity: () => Skill })
  skill: Skill;

  @Property({ type: 'date', fieldName: 'created_at' })
  createdAt: Date;

  @Property({ onUpdate: () => new Date(), fieldName: 'updated_at' })
  updatedAt: Date;
}