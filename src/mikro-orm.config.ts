import { Options, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

const config: Options = {
  driver: PostgreSqlDriver,
  dbName: 'louvorappdb',
  user: 'postgres',
  password: 'rock4me!!',
  host: 'localhost',
  port: 5432,
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/louvorapp/Entity/*.ts'],
  metadataProvider: TsMorphMetadataProvider,
  debug: true,
};

export default config;
