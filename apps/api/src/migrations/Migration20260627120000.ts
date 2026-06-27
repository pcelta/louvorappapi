import { Migration } from '@mikro-orm/migrations';

export class Migration20260627120000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table "users" add column "photo_path" text null;`);
    this.addSql(`alter table "users" alter column "password" drop not null;`);
    this.addSql(`alter table "users" alter column "phone" drop not null;`);

    this.addSql(`insert into "roles" ("uid", "name", "slug", "description", "created_at", "updated_at") values
      ('rol-worship-team', 'Membro da Equipe de Louvor', 'worship_team_member', 'Membro da equipe de louvor', now(), now())
      on conflict ("slug") do nothing;`);

    this.addSql(`create table "member_invitation" (
      "id" serial primary key,
      "code" text not null,
      "expires_at" timestamptz not null,
      "accepted" boolean not null default false,
      "accepted_at" timestamptz null,
      "created_at" date not null,
      "fk_member" int not null
    );`);
    this.addSql(`alter table "member_invitation" add constraint "member_invitation_code_unique" unique ("code");`);
    this.addSql(`alter table "member_invitation" add constraint "member_invitation_fk_member_foreign" foreign key ("fk_member") references "members" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "member_invitation";`);
    this.addSql(`delete from "roles" where "slug" = 'worship_team_member';`);
    this.addSql(`alter table "users" drop column "photo_path";`);
    this.addSql(`alter table "users" alter column "phone" set not null;`);
    this.addSql(`alter table "users" alter column "password" set not null;`);
  }
}