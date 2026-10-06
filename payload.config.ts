import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Users } from "./collections/Users";
import { Leads } from "./collections/Leads";
import { Notes } from "./collections/Notes";
import { FollowUps } from "./collections/FollowUps";
import { VisualKawasan } from "./collections/VisualKawasan";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Leads, Notes, FollowUps, VisualKawasan],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "lembur-udjo-payload-dev-secret-2026",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString:
        process.env.POSTGRES_URL || process.env.DATABASE_URL || "",
      max: 5,
    },
  }),
  sharp,
  routes: {
    admin: "/cms",
  },
  plugins: [],
});
