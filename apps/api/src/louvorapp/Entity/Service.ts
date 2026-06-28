import {
  Collection,
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
} from '@mikro-orm/core';
import Church from './Church';
import { ServicePastor } from './ServicePastor';

@Entity({ tableName: 'services' })
export default class Service {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'text', unique: true })
  uid: string;

  @Property({ type: 'text', nullable: true })
  title?: string;

  @Property({ type: 'text', nullable: true })
  subtitle?: string;

  @Property({ type: 'text', nullable: true })
  notes?: string;

  @Property({ type: 'boolean', fieldName: 'is_supper', default: false })
  isSupper: boolean;

  @Property({ type: 'datetime', fieldName: 'scheduled_at' })
  scheduledAt: Date;

  @Property({ type: 'date', fieldName: 'created_at' })
  createdAt: Date;

  @Property({ onUpdate: () => new Date(), fieldName: 'updated_at' })
  updatedAt: Date;

  @ManyToOne({ joinColumn: 'fk_church', entity: () => Church })
  church: Church;

  @OneToMany({
    entity: () => ServicePastor,
    mappedBy: 'service',
    orphanRemoval: true,
  })
  pastors: Collection<ServicePastor>;

  public toRaw() {
    return {
      uid: this.uid,
      title: this.title,
      subtitle: this.subtitle,
      notes: this.notes,
      is_supper: this.isSupper,
      scheduled_at: this.scheduledAt,
      created_at: this.createdAt,
      pastors: this.pastors?.isInitialized()
        ? this.pastors.getItems().map((sp) => ({
            uid: sp.member.uid,
            name: sp.member.user.name,
          }))
        : [],
    };
  }
}