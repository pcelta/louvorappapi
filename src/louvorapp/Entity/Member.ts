import { Collection, Entity, OneToOne, PrimaryKey, Property, OneToMany, ManyToOne } from '@mikro-orm/core';
import User from './User';
import { MemberRole } from './MemberRole';
import Church from './Church';

@Entity({ tableName: 'members' })
export default class Member {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'text' })
  uid: string

  @Property({ type: 'date', fieldName: 'created_at' })
  createdAt: Date

  @Property({ onUpdate: () => new Date(), fieldName: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => User, { joinColumn: "fk_user" })
  user: User;

  @OneToMany({ entity: () => MemberRole, mappedBy: 'member', orphanRemoval: true })
  memberRoles: Collection<MemberRole>

  @ManyToOne({ joinColumn: 'fk_church', entity: () => Member})
  church: Church;

  public toRaw() {
    return {
      uid: this.uid,
      createdAt: this.createdAt,
      user: this.user.toRaw()
    };
  }
}
