import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Worship } from './Worship';
import { Song } from './Song';

@Entity({ tableName: 'worship_songs' })
export class WorshipSong {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'text', unique: true })
  uid: string;

  @Property({ type: 'integer' })
  position: number;

  @Property({ type: 'date', fieldName: 'created_at' })
  createdAt: Date;

  @Property({ onUpdate: () => new Date(), fieldName: 'updated_at' })
  updatedAt: Date;

  @ManyToOne({ joinColumn: 'fk_worship', entity: () => Worship })
  worship: Worship;

  @ManyToOne({ joinColumn: 'fk_song', entity: () => Song })
  song: Song;
}