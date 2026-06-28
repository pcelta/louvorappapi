import { Migration } from '@mikro-orm/migrations';

export class Migration20260628110000 extends Migration {
  override async up(): Promise<void> {
    this.addSql(`insert into "roles" ("uid", "name", "slug", "description", "created_at", "updated_at") values
      ('rol-pastor', 'Pastor', 'pastor', 'Pastor da igreja', now(), now())
      on conflict ("slug") do nothing;`);

    this.addSql(`create table "services" (
      "id" serial primary key,
      "uid" text not null,
      "title" text null,
      "subtitle" text null,
      "notes" text null,
      "is_supper" boolean not null default false,
      "scheduled_at" timestamptz not null,
      "created_at" date not null,
      "updated_at" timestamptz not null,
      "fk_church" int not null
    );`);
    this.addSql(`alter table "services" add constraint "services_uid_unique" unique ("uid");`);
    this.addSql(`alter table "services" add constraint "services_fk_church_foreign" foreign key ("fk_church") references "churches" ("id") on update cascade;`);

    this.addSql(`create table "service_pastors" (
      "id" serial primary key,
      "fk_service" int not null,
      "fk_member" int not null,
      "created_at" date not null,
      "updated_at" timestamptz not null
    );`);
    this.addSql(`alter table "service_pastors" add constraint "service_pastors_fk_service_foreign" foreign key ("fk_service") references "services" ("id") on update cascade;`);
    this.addSql(`alter table "service_pastors" add constraint "service_pastors_fk_member_foreign" foreign key ("fk_member") references "members" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "service_pastors";`);
    this.addSql(`drop table if exists "services";`);
    this.addSql(`delete from "roles" where "slug" = 'pastor';`);
  }
}