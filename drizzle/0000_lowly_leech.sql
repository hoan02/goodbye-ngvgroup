CREATE TABLE "profiles" (
	"id" serial PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"role" text,
	"department" text,
	"avatar_url" text,
	"bg_image_url" text DEFAULT '/images/Year_End_Party_NGV_Group.jpeg',
	"logo_url" text DEFAULT '/logo.png',
	"tagline" text,
	"button_text" text DEFAULT 'Bắt Đầu',
	"music_url" text,
	"music_title" text,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "profiles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sections" (
	"id" serial PRIMARY KEY NOT NULL,
	"profile_id" integer,
	"title" text NOT NULL,
	"type" text NOT NULL,
	"content" text,
	"items" jsonb,
	"order" integer DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE "sections" ADD CONSTRAINT "sections_profile_id_profiles_id_fk" FOREIGN KEY ("profile_id") REFERENCES "public"."profiles"("id") ON DELETE cascade ON UPDATE no action;