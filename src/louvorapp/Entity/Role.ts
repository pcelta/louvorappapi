import { Entity, PrimaryKey, Property, OneToOne } from '@mikro-orm/core';

@Entity({tableName: 'roles'})
export class Role {

  public static ROLE_MEMBER = 'member';

  @PrimaryKey()
  id!: number;

  @Property({ type: 'text', unique: true })
  uid: string;

  @Property({ type: 'text' })
  name: string;

  @Property({ type: 'text', unique: true })
  slug: string;

  @Property({ type: 'text' })
  description: string;

  @Property({ type: 'date', fieldName: 'created_at' })
  createdAt: Date;

  @Property({ onUpdate: () => new Date(), fieldName: 'updated_at' })
  updatedAt: Date;
}
