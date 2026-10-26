import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN
    CREATE TYPE "public"."enum_visual_kawasan_section" AS ENUM('banner', 'fasilitas', 'galeri');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."enum_visual_kawasan_area" AS ENUM('area-depan', 'panggung', 'kolam', 'fasilitas', 'lainnya');
  EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  CREATE TABLE IF NOT EXISTS "visual_kawasan" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"placement" varchar,
  	"section" "enum_visual_kawasan_section",
  	"title" varchar,
  	"category" varchar,
  	"position" numeric DEFAULT 0,
  	"visible" boolean DEFAULT true,
  	"alt" varchar NOT NULL,
  	"area" "enum_visual_kawasan_area" NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  -- Older environments created the upload collection through Payload's dev push.
  -- Add only the new metadata there; never recreate or truncate existing media.
  ALTER TABLE "visual_kawasan" ADD COLUMN IF NOT EXISTS "placement" varchar;
  ALTER TABLE "visual_kawasan" ADD COLUMN IF NOT EXISTS "section" "enum_visual_kawasan_section";
  ALTER TABLE "visual_kawasan" ADD COLUMN IF NOT EXISTS "title" varchar;
  ALTER TABLE "visual_kawasan" ADD COLUMN IF NOT EXISTS "category" varchar;
  ALTER TABLE "visual_kawasan" ADD COLUMN IF NOT EXISTS "position" numeric DEFAULT 0;
  ALTER TABLE "visual_kawasan" ADD COLUMN IF NOT EXISTS "visible" boolean DEFAULT true;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN IF NOT EXISTS "visual_kawasan_id" integer;
  CREATE UNIQUE INDEX IF NOT EXISTS "visual_kawasan_placement_idx" ON "visual_kawasan" USING btree ("placement");
  CREATE INDEX IF NOT EXISTS "visual_kawasan_updated_at_idx" ON "visual_kawasan" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "visual_kawasan_created_at_idx" ON "visual_kawasan" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "visual_kawasan_filename_idx" ON "visual_kawasan" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "visual_kawasan_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "visual_kawasan" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX IF NOT EXISTS "visual_kawasan_sizes_card_sizes_card_filename_idx" ON "visual_kawasan" USING btree ("sizes_card_filename");
  CREATE INDEX IF NOT EXISTS "visual_kawasan_sizes_hero_sizes_hero_filename_idx" ON "visual_kawasan" USING btree ("sizes_hero_filename");
  DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'payload_locked_documents_rels_visual_kawasan_fk' AND conrelid = 'public.payload_locked_documents_rels'::regclass) THEN
      ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_visual_kawasan_fk" FOREIGN KEY ("visual_kawasan_id") REFERENCES "public"."visual_kawasan"("id") ON DELETE cascade ON UPDATE no action;
    END IF;
  END $$;
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_visual_kawasan_id_idx" ON "payload_locked_documents_rels" USING btree ("visual_kawasan_id");`)
}

// Preserve uploaded files and the original media table when rolling back.
export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "visual_kawasan_placement_idx";
    ALTER TABLE "visual_kawasan" DROP COLUMN IF EXISTS "placement";
    ALTER TABLE "visual_kawasan" DROP COLUMN IF EXISTS "section";
    ALTER TABLE "visual_kawasan" DROP COLUMN IF EXISTS "title";
    ALTER TABLE "visual_kawasan" DROP COLUMN IF EXISTS "category";
    ALTER TABLE "visual_kawasan" DROP COLUMN IF EXISTS "position";
    ALTER TABLE "visual_kawasan" DROP COLUMN IF EXISTS "visible";
    DROP TYPE IF EXISTS "public"."enum_visual_kawasan_section";
  `)
}
