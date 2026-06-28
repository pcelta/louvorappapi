import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import Service from './Service';
import Member from './Member';

@Entity({ tableName: 'service_pastors' })
export class ServicePastor {
  @PrimaryKey()
  id!: number;

  @ManyToOne({ joinColumn: 'fk_service', entity: () => Service })
  service: Service;

  @ManyToOne({ joinColumn: 'fk_member', entity: () => Member })
  member: Member;

  @Property({ type: 'date', fieldName: 'created_at' })
  createdAt: Date;

  @Property({ onUpdate: () => new Date(), fieldName: 'updated_at' })
  updatedAt: Date;
}