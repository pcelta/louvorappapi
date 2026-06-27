import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'skills' })
export class Skill {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'text', unique: true })
  uid: string;

  @Property({ type: 'text', unique: true })
  slug: string;

  @Property({ type: 'text' })
  name: string;

  @Property({ type: 'text' })
  icon: string;

  @Property({ type: 'date', fieldName: 'created_at' })
  createdAt: Date;

  @Property({ onUpdate: () => new Date(), fieldName: 'updated_at' })
  updatedAt: Date;

  public toRaw() {
    return {
      uid: this.uid,
      slug: this.slug,
      name: this.name,
      icon: this.icon,
    };
  }
}