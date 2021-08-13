import * as path from 'path';
import {ConnectionOptions} from 'typeorm';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({path: path.resolve(process.cwd(), '.env.development')})

const config: ConnectionOptions = {
  type: "mysql",
  host: "localhost",
  port: parseInt(`${process.env.MYSQL_PORT}`),
  username: process.env.MYSQL_USERNAME,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DBNAME,
  charset: "utf8mb4",
  logging: true,
  synchronize: false,
  migrationsRun: true,
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: "src/migrations",
  },
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
};

export default config;

