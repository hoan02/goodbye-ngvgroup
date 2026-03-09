import { pgTable, serial, text, integer, timestamp, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  role: text("role"),
  department: text("department"),
  avatarUrl: text("avatar_url"),
  bgImageUrl: text("bg_image_url").default("/images/Year_End_Party_NGV_Group.jpeg"),
  logoUrl: text("logo_url").default("/logo.png"),
  tagline: text("tagline"),
  buttonText: text("button_text").default("Bắt Đầu"),
  musicUrl: text("music_url"),
  musicTitle: text("music_title"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const sections = pgTable("sections", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id").references(() => profiles.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  type: text("type").notNull(), 
  content: text("content"),
  items: jsonb("items"), 
  order: integer("order").default(0),
});

export const profileRelations = relations(profiles, ({ many }) => ({
  sections: many(sections),
}));

export const sectionRelations = relations(sections, ({ one }) => ({
  profile: one(profiles, {
    fields: [sections.profileId],
    references: [profiles.id],
  }),
}));
