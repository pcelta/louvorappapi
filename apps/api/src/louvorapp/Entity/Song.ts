import {
  Collection,
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
} from '@mikro-orm/core';
import { Artist } from './Artist';
import { SongLink } from './SongLink';
import Church from './Church';

export type SongAttributes = {
  occasions?: string[];
};

@Entity({ tableName: 'songs' })
export class Song {
  public static KEYS = [
    'C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'F', 'F#', 'Gb',
    'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B',
  ];

  @PrimaryKey()
  id!: number;

  @Property({ type: 'text', unique: true })
  uid: string;

  @Property({ type: 'text' })
  title: string;

  @Property({ type: 'text', nullable: true })
  lyrics?: string;

  @Property({ type: 'text', nullable: true })
  key?: string;

  @Property({ type: 'text', nullable: true })
  notes?: string;

  @Property({ type: 'integer', nullable: true })
  bpm?: number;

  @Property({ type: 'boolean', fieldName: 'has_multitrack', default: false })
  hasMultitrack: boolean;

  @Property({ type: 'boolean', fieldName: 'is_active', default: true })
  isActive: boolean;

  @Property({ type: 'json', columnType: 'jsonb', nullable: true })
  attributes?: SongAttributes;

  @Property({ type: 'date', fieldName: 'created_at' })
  createdAt: Date;

  @ManyToOne({ joinColumn: 'fk_church', entity: () => Church })
  church: Church;

  @ManyToOne({ joinColumn: 'fk_artist', entity: () => Artist })
  artist: Artist;

  @OneToMany({
    entity: () => SongLink,
    mappedBy: 'song',
    orphanRemoval: true,
  })
  links: Collection<SongLink>;

  public toRaw() {
    return {
      uid: this.uid,
      title: this.title,
      lyrics: this.lyrics,
      key: this.key,
      notes: this.notes,
      bpm: this.bpm,
      has_multitrack: this.hasMultitrack,
      is_active: this.isActive,
      attributes: this.attributes ?? null,
      created_at: this.createdAt,
      artist: this.artist?.toRaw() ?? null,
      links: this.links?.isInitialized()
        ? this.links.getItems().map((link) => link.toRaw())
        : [],
    };
  }
}