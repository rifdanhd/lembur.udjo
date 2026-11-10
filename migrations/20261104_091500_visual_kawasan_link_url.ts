import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

/**
 * The collection has exposed linkUrl for trending content, but older
 * visual_kawasan tables were created before that field existed.
 * Keep this additive so existing media rows and files are preserved.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "visual_kawasan"
      ADD COLUMN IF NOT EXISTS "link_url" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "visual_kawasan"
      DROP COLUMN IF EXISTS "link_url";
  `)
}
