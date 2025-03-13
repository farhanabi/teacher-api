import { migrate } from "drizzle-orm/mysql2/migrator";
import { db } from "./index";

async function main() {
	console.log("Running migrations...");
	await migrate(db, { migrationsFolder: "./src/db/migrations" });
	console.log("Migrations completed!");
	process.exit(0);
}

main().catch((err) => {
	console.error("Migration failed!");
	console.error(err);
	process.exit(1);
});
