import { Entity, PrimaryKey, Property, OneToOne } from '@mikro-orm/core';
import Member from './Member';
import UserAccess from './UserAccess';
import * as bcrypt from 'bcrypt';

@Entity({ tableName: 'users' })
export default class User {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'text' })
  uid: string;

  @Property({ type: 'text' })
  email: string;

  @Property({ type: 'text', nullable: true })
  password?: string;

  @Property({ type: 'text' })
  name: string;

  @Property({ type: 'date', nullable: true })
  dob?: Date;

  @Property({ type: 'text', nullable: true })
  phone?: string;

  @Property({ type: 'text', fieldName: 'photo_path', nullable: true })
  photoPath?: string;

  @Property({ type: 'date', fieldName: 'created_at' })
  createdAt: Date;

  @Property({ onUpdate: () => new Date(), fieldName: 'updated_at' })
  updatedAt: Date;

  @OneToOne({ entity: () => Member, mappedBy: (member) => member.user })
  member: Member;

  @OneToOne({ entity: () => UserAccess, mappedBy: (access) => access.user })
  access: UserAccess;

  public async setPassword(password: string) {
    const saltOrRounds = 15;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    this.password = hashedPassword;
  }

  public toRaw() {
    let raw = {
      email: this.email,
      dob: this.dob,
      uid: this.uid,
      name: this.name,
      phone: this.phone,
      photo_path: this.photoPath,
    };

    return raw;
  }
}
