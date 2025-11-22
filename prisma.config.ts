// prisma.config.ts
import "dotenv/config";
import path from "node:path";
import { defineConfig, env } from "prisma/config";
import { PrismaPg } from "@prisma/adapter-pg";

type Env = {
  DATABASE_URL: string;
};

export default defineConfig({
  // schema path (relative to project root)
  schema: path.join("prisma", "schema.prisma"),

  // where migrations live
  migrations: {
    path: path.join("prisma", "migrations"),
  },

  // move DATABASE_URL here
  datasource: {
    url: env<Env>("DATABASE_URL"),
  },

  // use the pg adapter for both client and migrate
  client: {
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  },

  migrate: {
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
  },
});
