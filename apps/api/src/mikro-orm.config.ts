import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Migrator } from '@mikro-orm/migrations';

export default defineConfig({
  dbName: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT),
  entities: ['dist/louvorapp/Entity'],
  entitiesTs: ['src/louvorapp/Entity'],
  metadataProvider: TsMorphMetadataProvider,
  extensions: [Migrator],
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: 'dist/migrations',
    pathTs: 'src/migrations',
    glob: '!(*.d).{js,ts}',
    transactional: true,
    allOrNothing: true,
    snapshot: true,
    emit: 'ts',
  },
  debug: true,
});