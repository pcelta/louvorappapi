import { Migration } from '@mikro-orm/migrations';

export class Migration20260627130000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`create table "skills" (
      "id" serial primary key,
      "uid" text not null,
      "slug" text not null,
      "name" text not null,
      "icon" text not null,
      "created_at" date not null,
      "updated_at" timestamptz not null
    );`);
    this.addSql(`alter table "skills" add constraint "skills_uid_unique" unique ("uid");`);
    this.addSql(`alter table "skills" add constraint "skills_slug_unique" unique ("slug");`);

    this.addSql(`insert into "skills" ("uid", "slug", "name", "icon", "created_at", "updated_at") values
      ('skl-singer', 'singer', 'Vocal', 'microphone', now(), now()),
      ('skl-guitar', 'guitar-player', 'Guitarra', 'guitar', now(), now()),
      ('skl-bass', 'bass-guitar-player', 'Baixo', 'bass', now(), now()),
      ('skl-keyboard', 'keyboard-player', 'Teclado', 'keyboard', now(), now()),
      ('skl-acoustic', 'acoustic-guitar-player', 'Violão', 'acoustic-guitar', now(), now()),
      ('skl-drums', 'drums-player', 'Bateria', 'drums', now(), now())
      on conflict ("slug") do nothing;`);

    this.addSql(`create table "member_skills" (
      "id" serial primary key,
      "fk_member" int not null,
      "fk_skill" int not null,
      "created_at" date not null,
      "updated_at" timestamptz not null
    );`);
    this.addSql(`alter table "member_skills" add constraint "member_skills_fk_member_foreign" foreign key ("fk_member") references "members" ("id") on update cascade;`);
    this.addSql(`alter table "member_skills" add constraint "member_skills_fk_skill_foreign" foreign key ("fk_skill") references "skills" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "member_skills";`);
    this.addSql(`drop table if exists "skills";`);
  }
}