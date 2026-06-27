import { Migration } from '@mikro-orm/migrations';

export class Migration20260628100000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create table "artists" (
      "id" serial primary key,
      "uid" text not null,
      "name" text not null,
      "cover_image" text null,
      "created_at" date not null
    );`);
    this.addSql(`alter table "artists" add constraint "artists_uid_unique" unique ("uid");`);

    this.addSql(`create table "songs" (
      "id" serial primary key,
      "uid" text not null,
      "title" text not null,
      "lyrics" text null,
      "key" text null,
      "notes" text null,
      "bpm" int null,
      "has_multitrack" boolean not null default false,
      "is_active" boolean not null default true,
      "attributes" jsonb null,
      "created_at" date not null,
      "fk_church" int not null,
      "fk_artist" int not null
    );`);
    this.addSql(`alter table "songs" add constraint "songs_uid_unique" unique ("uid");`);
    this.addSql(`alter table "songs" add constraint "songs_fk_church_foreign" foreign key ("fk_church") references "churches" ("id") on update cascade;`);
    this.addSql(`alter table "songs" add constraint "songs_fk_artist_foreign" foreign key ("fk_artist") references "artists" ("id") on update cascade;`);

    this.addSql(`create table "song_links" (
      "id" serial primary key,
      "uid" text not null,
      "url" text not null,
      "type" text not null,
      "created_at" date not null,
      "fk_song" int not null
    );`);
    this.addSql(`alter table "song_links" add constraint "song_links_uid_unique" unique ("uid");`);
    this.addSql(`alter table "song_links" add constraint "song_links_fk_song_foreign" foreign key ("fk_song") references "songs" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "song_links";`);
    this.addSql(`drop table if exists "songs";`);
    this.addSql(`drop table if exists "artists";`);
  }
}