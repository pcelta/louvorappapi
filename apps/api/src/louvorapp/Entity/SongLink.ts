import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { Song } from './Song';

@Entity({ tableName: 'song_links' })
export class SongLink {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'text', unique: true })
  uid: string;

  @Property({ type: 'text' })
  url: string;

  @Property({ type: 'text' })
  type: string;

  @Property({ type: 'date', fieldName: 'created_at' })
  createdAt: Date;

  @ManyToOne({ joinColumn: 'fk_song', entity: () => Song })
  song: Song;

  public toRaw() {
    return {
      uid: this.uid,
      url: this.url,
      type: this.type,
    };
  }
}