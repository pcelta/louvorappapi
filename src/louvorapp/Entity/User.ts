import { Entity, PrimaryKey, Property, OneToOne } from '@mikro-orm/core';
import Member from './Member';
import UserAccess from './UserAccess';

@Entity({ tableName: 'users'})
export default class User {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'text' })
  uid: string

  @Property({ type: 'text' })
  email: string

  @Property({ type: 'text' })
  password: string

  @Property({ type: 'date', fieldName: 'created_at' })
  createdAt: Date

  @Property({ onUpdate: () => new Date(), fieldName: 'updated_at' })
  updatedAt: Date;

  @OneToOne({entity: () => Member, mappedBy: member => member.user})
  member: Member;

  @OneToOne({entity: () => UserAccess, mappedBy: access => access.user})
  access: UserAccess;

  public toRaw(includeAccesses: boolean) {
    let raw = {
      uid: this.uid,
      email: this.email,
      access: null
    };

    if (includeAccesses) {
      raw.access = this.access.toRaw()
    }

    return raw;
  }
}
