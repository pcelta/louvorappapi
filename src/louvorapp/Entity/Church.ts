import { Collection, Entity, OneToOne, PrimaryKey, Property, OneToMany, ArrayCollection } from '@mikro-orm/core';
import ChurchMember from './ChurchMember';

@Entity({ tableName: 'churches' })
export default class Church {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'text' })
  uid: string

  @Property({ type: 'text' })
  name: string

  @Property({ type: 'text', fieldName: 'logo_path' })
  logoPath: string

  @Property({ type: 'date', fieldName: 'created_at' })
  createdAt: Date

  @Property({ onUpdate: () => new Date(), fieldName: 'updated_at' })
  updatedAt: Date;

  public toRaw() {
    return {
      'uid': this.uid,
      'name': this.name,
      'created_at': this.createdAt,
      'updated_at': this.updatedAt
    }
  }
}
