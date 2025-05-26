import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import * as path from 'path';

export default (): PostgresConnectionOptions => ({
  type: 'postgres',
  host: process.env.db_host,
  port: Number(process.env.db_port),
  username: process.env.db_user,
  password: process.env.db_password,
  database: process.env.db_name,
  entities: [path.resolve(__dirname, '../..') + '/**/*.entity{.ts,.js}'],
  synchronize: true,
  // dropSchema: true, // ALERT!!! This option will drop all tables and recreate them every time you start the application. Use it only for development. Delete all data.
});
