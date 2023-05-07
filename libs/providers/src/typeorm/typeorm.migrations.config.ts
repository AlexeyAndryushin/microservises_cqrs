import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';
import { ConfigService } from '@nestjs/config';

config({ path: join(process.cwd(), '.env') });
const configService = new ConfigService();

const options = (): DataSourceOptions => {
  const url = configService.get('DATABASE_URL');
  if (!url) {
    throw new Error('Database url is empty');
  }
  return {
    url,
    type: 'postgres',
    schema: 'public',
    logging: configService.get('IS_PROD') === 'false',
    migrations: [
      join(process.cwd(), 'dist', 'migrations', '**', '*migration.js'),
    ],

    migrationsRun: true,
    migrationsTableName: 'migrations',
  };
};

export const appDataSource = new DataSource(options());