import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Worship } from './Worship';
import Member from './Member';

@Entity({ tableName: 'worship_team_roster' })
export class WorshipTeamRoster {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'text', unique: true })
  uid: string;

  @Property({ type: 'date', fieldName: 'created_at' })
  createdAt: Date;

  @Property({ onUpdate: () => new Date(), fieldName: 'updated_at' })
  updatedAt: Date;

  @ManyToOne({ joinColumn: 'fk_worship', entity: () => Worship })
  worship: Worship;

  @ManyToOne({ joinColumn: 'fk_member', entity: () => Member })
  member: Member;
}