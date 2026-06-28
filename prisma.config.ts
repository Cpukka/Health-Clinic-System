// prisma.config.ts
import { defineConfig, env } from "prisma/config";
import dotenv from "dotenv";

// Manually load .env file
dotenv.config();

console.log("🔍 DATABASE_URL from process.env:", process.env.DATABASE_URL ? "✅ Set" : "❌ Not set");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});