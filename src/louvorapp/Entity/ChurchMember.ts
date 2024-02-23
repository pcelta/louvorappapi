import { Collection, Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import Church from './Church';
import Member from './Member';

@Entity({ tableName: 'church_members' })
export default class ChurchMember {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'text' })
  logoPath: string;

  @Property({fieldName: 'is_active', type: 'boolean'})
  isActive: boolean;

  @Property({ type: 'date', fieldName: 'created_at' })
  createdAt: Date

  @Property({ onUpdate: () => new Date(), fieldName: 'updated_at' })
  updatedAt: Date;

  @ManyToOne({ joinColumn: 'fk_member', entity: () => Member})
  member: Member;

  @ManyToOne({ joinColumn: 'fk_church', entity: () => Member})
  church: Church;
}
