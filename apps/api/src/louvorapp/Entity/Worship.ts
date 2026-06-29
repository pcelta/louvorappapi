import {
  Collection,
  Entity,
  PrimaryKey,
  Property,
  ManyToOne,
  OneToMany,
} from '@mikro-orm/core';
import Service from './Service';
import { WorshipSong } from './WorshipSong';
import { WorshipTeamRoster } from './WorshipTeamRoster';

@Entity({ tableName: 'worship' })
export class Worship {
  @PrimaryKey()
  id!: number;

  @Property({ type: 'text', unique: true })
  uid: string;

  @Property({ type: 'text' })
  title: string;

  @Property({ type: 'date', fieldName: 'created_at' })
  createdAt: Date;

  @Property({ onUpdate: () => new Date(), fieldName: 'updated_at' })
  updatedAt: Date;

  @ManyToOne({ joinColumn: 'fk_service', entity: () => Service })
  service: Service;

  @OneToMany({
    entity: () => WorshipSong,
    mappedBy: 'worship',
    orphanRemoval: true,
  })
  songs: Collection<WorshipSong>;

  @OneToMany({
    entity: () => WorshipTeamRoster,
    mappedBy: 'worship',
    orphanRemoval: true,
  })
  roster: Collection<WorshipTeamRoster>;

  public toRaw() {
    const songs = this.songs?.isInitialized()
      ? this.songs
          .getItems()
          .sort((a, b) => a.position - b.position)
          .map((ws) => ({
            uid: ws.uid,
            position: ws.position,
            song: {
              uid: ws.song.uid,
              title: ws.song.title,
              key: ws.song.key,
              artist: ws.song.artist ? { name: ws.song.artist.name } : null,
            },
          }))
      : [];

    const team = this.roster?.isInitialized()
      ? this.roster.getItems().map((r) => ({
          uid: r.member.uid,
          name: r.member.user.name,
          photo_path: r.member.user.photoPath,
        }))
      : [];

    return {
      uid: this.uid,
      title: this.title,
      service: this.service
        ? { uid: this.service.uid, title: this.service.title, scheduled_at: this.service.scheduledAt }
        : null,
      songs,
      team,
    };
  }
}