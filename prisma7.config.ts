import "dotenv/config";
import { defineConfig, env } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    // The CLI uses this for migrations. Point it to your direct connection.
    url: env("DIRECT_URL"),
  },
});
