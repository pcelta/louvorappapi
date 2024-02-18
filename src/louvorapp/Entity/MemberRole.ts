import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import Member from './Member';
import { Role } from './Role';

@Entity({tableName: 'member_roles'})
export class MemberRole {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ joinColumn: 'fk_member', entity: () => Member})
  member: Member;

  @ManyToOne({ joinColumn: 'fk_role'})
  role: Role;

  @Property({ type: 'date', fieldName: 'created_at' })
  createdAt: Date;

  @Property({ onUpdate: () => new Date(), fieldName: 'updated_at' })
  updatedAt: Date;
}
