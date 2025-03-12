import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
	PORT: z.string().default("3000"),
	NODE_ENV: z
		.enum(["development", "production", "test"])
		.default("development"),
	DB_HOST: z.string().default("localhost"),
	DB_PORT: z.string().default("3306"),
	DB_USER: z.string().default("root"),
	DB_PASSWORD: z.string(),
	DB_NAME: z.string().default("teacher_api"),
});

const env = envSchema.parse(process.env);

export default {
	port: Number.parseInt(env.PORT, 10),
	nodeEnv: env.NODE_ENV,
	db: {
		host: env.DB_HOST,
		port: Number.parseInt(env.DB_PORT, 10),
		user: env.DB_USER,
		password: env.DB_PASSWORD,
		database: env.DB_NAME,
	},
	isTest: env.NODE_ENV === "test",
};
