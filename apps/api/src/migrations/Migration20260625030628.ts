import { Migration } from '@mikro-orm/migrations';

export class Migration20260625030628 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "users" add column "phone" text not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "users" drop column "phone";`);
  }

}
