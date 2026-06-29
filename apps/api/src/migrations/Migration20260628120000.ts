import { Migration } from '@mikro-orm/migrations';

export class Migration20260628120000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create table "worship" (
      "id" serial primary key,
      "uid" text not null,
      "title" text not null,
      "created_at" date not null,
      "updated_at" timestamptz not null,
      "fk_service" int not null
    );`);
    this.addSql(`alter table "worship" add constraint "worship_uid_unique" unique ("uid");`);
    this.addSql(`alter table "worship" add constraint "worship_fk_service_foreign" foreign key ("fk_service") references "services" ("id") on update cascade;`);

    this.addSql(`create table "worship_songs" (
      "id" serial primary key,
      "uid" text not null,
      "position" int not null,
      "created_at" date not null,
      "updated_at" timestamptz not null,
      "fk_worship" int not null,
      "fk_song" int not null
    );`);
    this.addSql(`alter table "worship_songs" add constraint "worship_songs_uid_unique" unique ("uid");`);
    this.addSql(`alter table "worship_songs" add constraint "worship_songs_fk_worship_foreign" foreign key ("fk_worship") references "worship" ("id") on update cascade;`);
    this.addSql(`alter table "worship_songs" add constraint "worship_songs_fk_song_foreign" foreign key ("fk_song") references "songs" ("id") on update cascade;`);

    this.addSql(`create table "worship_team_roster" (
      "id" serial primary key,
      "uid" text not null,
      "created_at" date not null,
      "updated_at" timestamptz not null,
      "fk_worship" int not null,
      "fk_member" int not null
    );`);
    this.addSql(`alter table "worship_team_roster" add constraint "worship_team_roster_uid_unique" unique ("uid");`);
    this.addSql(`alter table "worship_team_roster" add constraint "worship_team_roster_fk_worship_foreign" foreign key ("fk_worship") references "worship" ("id") on update cascade;`);
    this.addSql(`alter table "worship_team_roster" add constraint "worship_team_roster_fk_member_foreign" foreign key ("fk_member") references "members" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "worship_team_roster";`);
    this.addSql(`drop table if exists "worship_songs";`);
    this.addSql(`drop table if exists "worship";`);
  }
}