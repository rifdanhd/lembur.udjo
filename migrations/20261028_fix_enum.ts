import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- Drop and recreate the enum with all required values
    DO $$ BEGIN
      -- Check if enum exists and alter it
      IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_visual_kawasan_section') THEN
        -- Add missing values
        ALTER TYPE "public"."enum_visual_kawasan_section" ADD VALUE IF NOT EXISTS 'masterplan';
        ALTER TYPE "public"."enum_visual_kawasan_section" ADD VALUE IF NOT EXISTS 'siteplan';
        ALTER TYPE "public"."enum_visual_kawasan_section" ADD VALUE IF NOT EXISTS 'zona-siteplan';
        ALTER TYPE "public"."enum_visual_kawasan_section" ADD VALUE IF NOT EXISTS 'trending';
      ELSE
        CREATE TYPE "public"."enum_visual_kawasan_section" AS ENUM('banner', 'fasilitas', 'galeri', 'masterplan', 'siteplan', 'zona-siteplan', 'trending');
      END IF;
    EXCEPTION WHEN OTHERS THEN NULL; END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Note: PostgreSQL doesn't easily support removing enum values
  // This is a no-op down migration
}
