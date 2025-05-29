import { ConnectionOptions } from "mysql2";

const db_config: ConnectionOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT as any as number,
  // ssl: "REQUIRED",
  // waitForConnections: true,
  // connectionLimit: 10,
  // queueLimit: 0,
};

export default db_config;
