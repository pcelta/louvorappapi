import { Entity, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import User from './User';

@Entity({ tableName: 'members' })
export default class Member {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'text' })
  uid: string

  @Property({ type: 'text' })
  name: string

  @Property({ type: 'date' })
  dob: Date

  @Property({ type: 'date', fieldName: 'created_at' })
  createdAt: Date

  @Property({ onUpdate: () => new Date(), fieldName: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => User, { joinColumn: "fk_user" })
  user: User;

  public toRaw() {
    return {
      uid: this.uid,
      name: this.name,
      dob: this.dob,
      createdAt: this.createdAt,
      user: this.user.toRaw()
    };
  }
}
