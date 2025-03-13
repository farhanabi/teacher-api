import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import env from "../config/env";

const poolConnection = mysql.createPool({
	host: env.db.host,
	port: env.db.port,
	user: env.db.user,
	password: env.db.password,
	database: env.db.database,
});

export const db = drizzle({ client: poolConnection });
