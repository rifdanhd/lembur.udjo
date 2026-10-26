import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "visual_kawasan" ADD COLUMN IF NOT EXISTS "hero_video_id" integer;
    DO $$ BEGIN
      ALTER TABLE "visual_kawasan" ADD CONSTRAINT "visual_kawasan_hero_video_id_visual_kawasan_id_fk"
        FOREIGN KEY ("hero_video_id") REFERENCES "public"."visual_kawasan"("id") ON DELETE SET NULL ON UPDATE NO ACTION;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    CREATE INDEX IF NOT EXISTS "visual_kawasan_hero_video_idx" ON "visual_kawasan" USING btree ("hero_video_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "visual_kawasan" DROP CONSTRAINT IF EXISTS "visual_kawasan_hero_video_id_visual_kawasan_id_fk";
    DROP INDEX IF EXISTS "visual_kawasan_hero_video_idx";
    ALTER TABLE "visual_kawasan" DROP COLUMN IF EXISTS "hero_video_id";
  `);
}
