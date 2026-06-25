import { Migration } from '@mikro-orm/migrations';

export class Migration20260623170922 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "churches" ("id" serial primary key, "uid" text not null, "name" text not null, "logo_path" text not null, "created_at" date not null, "updated_at" timestamptz not null);`);

    this.addSql(`create table "roles" ("id" serial primary key, "uid" text not null, "name" text not null, "slug" text not null, "description" text not null, "created_at" date not null, "updated_at" timestamptz not null);`);
    this.addSql(`alter table "roles" add constraint "roles_uid_unique" unique ("uid");`);
    this.addSql(`alter table "roles" add constraint "roles_slug_unique" unique ("slug");`);

    this.addSql(`create table "users" ("id" serial primary key, "uid" text not null, "email" text not null, "password" text not null, "name" text not null, "dob" date not null, "created_at" date not null, "updated_at" timestamptz not null);`);

    this.addSql(`create table "members" ("id" serial primary key, "uid" text not null, "created_at" date not null, "updated_at" timestamptz not null, "fk_user" int not null, "fk_church" int not null);`);
    this.addSql(`alter table "members" add constraint "members_fk_user_unique" unique ("fk_user");`);

    this.addSql(`create table "member_roles" ("id" serial primary key, "fk_member" int not null, "fk_role" int not null, "created_at" date not null, "updated_at" timestamptz not null);`);

    this.addSql(`create table "user_accesses" ("id" serial primary key, "access_token" text not null, "access_token_created_at" date not null, "access_token_expires_at" date not null, "created_at" date not null, "updated_at" date not null, "fk_user" int not null);`);
    this.addSql(`alter table "user_accesses" add constraint "user_accesses_fk_user_unique" unique ("fk_user");`);

    this.addSql(`alter table "members" add constraint "members_fk_user_foreign" foreign key ("fk_user") references "users" ("id") on update cascade;`);
    this.addSql(`alter table "members" add constraint "members_fk_church_foreign" foreign key ("fk_church") references "churches" ("id") on update cascade;`);

    this.addSql(`alter table "member_roles" add constraint "member_roles_fk_member_foreign" foreign key ("fk_member") references "members" ("id") on update cascade;`);
    this.addSql(`alter table "member_roles" add constraint "member_roles_fk_role_foreign" foreign key ("fk_role") references "roles" ("id") on update cascade;`);

    this.addSql(`alter table "user_accesses" add constraint "user_accesses_fk_user_foreign" foreign key ("fk_user") references "users" ("id") on update cascade;`);
  }

}
