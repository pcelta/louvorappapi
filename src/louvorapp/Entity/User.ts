import { Entity, PrimaryKey, Property, OneToOne } from '@mikro-orm/core';
import Member from './Member';

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

  public toRaw() {
    return {
      uid: this.uid,
      email: this.email
    };
  }
}
