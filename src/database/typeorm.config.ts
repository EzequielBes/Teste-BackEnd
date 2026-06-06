import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { registerAs } from '@nestjs/config';

dotenv.config({ path: '.env' });

const config: DataSourceOptions = {
  type: 'mssql',
  host: `${process.env.DB_HOST || 'localhost'}`,
  port: Number(process.env.DB_PORT || 1433),
  username: `${process.env.DB_USER || 'sa'}`,
  password: `${process.env.DB_PASSWORD || 'YourStrong!Passw0rd'}`,
  database: `${process.env.DB_NAME || 'fleetapi_db'}`,
  entities: [__dirname + '/../**/*.entity.{js,ts}'],
  migrations: [__dirname + '/../**/migrations/*{.ts,.js}'],
  synchronize: true,
  extra: {
    trustServerCertificate: true,
  },
};

export default registerAs('typeorm', () => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
