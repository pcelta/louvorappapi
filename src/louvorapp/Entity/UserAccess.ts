import { Entity, PrimaryKey, Property, OneToOne } from '@mikro-orm/core';
import Member from './Member';
import User from './User';

@Entity({ tableName: 'user_accesses'})
export default class UserAccess {
  public static REFRESH_TOKEN_DAYS_TO_EXPIRE = 15;
  public static ACCESS_TOKEN_DAYS_TO_EXPIRE = 5;

  @PrimaryKey()
  id!: number;

  @Property({ type: 'text', fieldName: 'access_token' })
  accessToken: string;

  @Property({ type: 'date', fieldName: 'access_token_created_at' })
  accessTokenCreatedAt: Date;

  @Property({ type: 'date', fieldName: 'access_token_expires_at' })
  accessTokenExpiresdAt: Date;

  @Property({ type: 'date', fieldName: 'created_at' })
  createdAt: Date;

  @Property({ type: 'date', fieldName: 'updated_at' })
  updatedAt: Date;

  @OneToOne(() => User, { joinColumn: "fk_user" })
  user: User;
}
