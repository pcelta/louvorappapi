import { Migration } from '@mikro-orm/migrations';

export class Migration20260627000000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`alter table "users" alter column "dob" drop not null;`);

    this.addSql(`insert into "roles" ("uid", "name", "slug", "description", "created_at", "updated_at") values
      ('rol-admin', 'Administrador', 'admin', 'Administrador da igreja', now(), now()),
      ('rol-member', 'Membro', 'member', 'Membro da igreja', now(), now())
      on conflict ("slug") do nothing;`);
  }

  override async down(): Promise<void> {
    this.addSql(`delete from "roles" where "slug" in ('admin', 'member');`);
    this.addSql(`alter table "users" alter column "dob" set not null;`);
  }
}