import { boolean, integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	created_at: timestamp().notNull().defaultNow(),
	google_uid: varchar({ length: 255 }).notNull(),
	type: varchar({ length: 255 }).notNull(),
	last_login: timestamp().notNull().defaultNow(),
});

export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

/** 
 * Posts Schema
 */

export const postsTable = pgTable("posts", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	author_id: integer().notNull(),
	created_at: timestamp().notNull().defaultNow(),
	updated_at: timestamp().notNull().defaultNow(),

	content: varchar({ length: 255 }).notNull(),
	youtube_embed: varchar({ length: 255 }),
	images: varchar({ length: 255 }).array().notNull().default([]),

	all_tags: integer().array().notNull().default([]),
	all_likes: integer().array().notNull().default([]),
	all_saved: integer().array().notNull().default([]),
	all_shares: integer().array().notNull().default([]),
});

export type InsertPost = typeof postsTable.$inferInsert;
export type SelectPost = typeof postsTable.$inferSelect;

export const tagsTable = pgTable("tags", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	category_id: integer().notNull(),
	created_at: timestamp().notNull().defaultNow(),

	title: varchar({ length: 255 }).notNull(),
	popularity: integer().notNull().default(0),
});

export type InsertTag = typeof tagsTable.$inferInsert;
export type SelectTag = typeof tagsTable.$inferSelect;

export const categoriesTable = pgTable("categories", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	created_at: timestamp().notNull().defaultNow(),

	title: varchar({ length: 255 }).notNull(),
	popularity: integer().notNull().default(0),
});

export type InsertCategory = typeof categoriesTable.$inferInsert;
export type SelectCategory = typeof categoriesTable.$inferSelect;

export const commentsTable = pgTable("comments", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	author_id: integer().notNull(),
	post_id: integer().notNull(),
	created_at: timestamp().notNull().defaultNow(),

	content: varchar({ length: 255 }).notNull(),
	all_likes: integer().array().notNull().default([]),
});

export type InsertComment = typeof commentsTable.$inferInsert;
export type SelectComment = typeof commentsTable.$inferSelect;

/**
 * Messages Schema
 */

export const conversationsTable = pgTable("conversations", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	created_at: timestamp().notNull().defaultNow(),
	updated_at: timestamp().notNull().defaultNow(),
});

export type InsertConversation = typeof conversationsTable.$inferInsert;
export type SelectConversation = typeof conversationsTable.$inferSelect;

export const participantsTable = pgTable("participants", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	profile_id: integer().notNull(),
	conversation_id: integer().notNull(),
	added_at: timestamp().notNull().defaultNow(),
});

export type InsertParticipant = typeof participantsTable.$inferInsert;
export type SelectParticipant = typeof participantsTable.$inferSelect;

export const messagesTable = pgTable("messages", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	conversation_id: integer().notNull(),
	sender_id: integer().notNull(),
	receiver_id: integer().notNull(),
	sent_at: timestamp().notNull().defaultNow(),
	updated_at: timestamp().notNull().defaultNow(),

	content: varchar({ length: 255 }).notNull(),
	images: varchar({ length: 255 }).array().notNull().default([]),
	is_read: boolean().notNull().default(false),
});

export type InsertMessage = typeof messagesTable.$inferInsert;
export type SelectMessage = typeof messagesTable.$inferSelect;

/**
 * Notifications Schema
 */

export const notificationsTable = pgTable("notifications", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	author_id: integer().notNull(),
	recipient_id: integer().notNull(),
	created_at: timestamp().notNull().defaultNow(),

	content: varchar({ length: 255 }).notNull(),
	type: varchar({ length: 255 }).notNull(),
	is_read: boolean().notNull().default(false),
});

export type InsertNotification = typeof notificationsTable.$inferInsert;
export type SelectNotification = typeof notificationsTable.$inferSelect;

/**
 * Profile Schema
 */

export const profilesTable = pgTable("profiles", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	user_id: integer().notNull(),
	created_at: timestamp().notNull().defaultNow(),
	updated_at: timestamp().notNull().defaultNow(),

	first_name: varchar({ length: 255 }).notNull(),
	last_name: varchar({ length: 255 }).notNull(),
	middle_name: varchar({ length: 255 }),
	suffix: varchar({ length: 255 }),
	birth_date: timestamp(),

	avatar_url: varchar({ length: 255 }),
	cover_url: varchar({ length: 255 }),

	username: varchar({ length: 255 }).notNull(),
	bio: varchar({ length: 255 }),
	location: varchar({ length: 255 }),
	website_url: varchar({ length: 255 }),
	description: varchar({ length: 255 }),

	all_following: integer().array().notNull().default([]),
	all_followers: integer().array().notNull().default([]),
});

export type InsertProfile = typeof profilesTable.$inferInsert;
export type SelectProfile = typeof profilesTable.$inferSelect;

/**
 * Settings Schema
 */

export const notificationSettingsTable = pgTable("notification_settings", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	user_id: integer().notNull(),
	created_at: timestamp().notNull().defaultNow(),
	updated_at: timestamp().notNull().defaultNow(),

	notify_likes: boolean().notNull().default(false),
	notify_comments: boolean().notNull().default(false),
	notify_follows: boolean().notNull().default(false),
	notify_messages: boolean().notNull().default(false),
});

export type InsertNotificationSettings = typeof notificationSettingsTable.$inferInsert;
export type SelectNotificationSettings = typeof notificationSettingsTable.$inferSelect;

export const privacySettingsTable = pgTable("privacy_settings", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	user_id: integer().notNull(),
	created_at: timestamp().notNull().defaultNow(),
	updated_at: timestamp().notNull().defaultNow(),

	is_verified: boolean().notNull().default(false),
	is_public: boolean().notNull().default(false),
	show_active: boolean().notNull().default(false),
});

export type InsertPrivacySettings = typeof privacySettingsTable.$inferInsert;
export type SelectPrivacySettings = typeof privacySettingsTable.$inferSelect;