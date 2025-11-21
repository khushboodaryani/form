// prisma.config.ts
import "dotenv/config"; // ensures .env is loaded during CLI runs
import { defineConfig, env } from "prisma/config";

type Env = {
  DATABASE_URL: string;
};

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // read DB url from env via prisma config helper
    url: env<Env>("DATABASE_URL"),
  },
});
