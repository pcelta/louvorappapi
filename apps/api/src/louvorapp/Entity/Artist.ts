import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ tableName: 'artists' })
export class Artist {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'text', unique: true })
  uid: string;

  @Property({ type: 'text' })
  name: string;

  @Property({ type: 'text', fieldName: 'cover_image', nullable: true })
  coverImage?: string;

  @Property({ type: 'date', fieldName: 'created_at' })
  createdAt: Date;

  public toRaw() {
    return {
      uid: this.uid,
      name: this.name,
      cover_image: this.coverImage,
    };
  }
}