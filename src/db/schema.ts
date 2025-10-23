import { boolean, integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	created_at: timestamp().notNull().defaultNow(),
	google_uid: varchar({ length: 255 }).notNull(),
	type: varchar({ length: 255 }).notNull(),
	last_login: timestamp().notNull().defaultNow(),
});

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

export const tagsTable = pgTable("tags", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	category_id: integer().notNull(),
	created_at: timestamp().notNull().defaultNow(),

	title: varchar({ length: 255 }).notNull(),
	popularity: integer().notNull().default(0),
});

export const categoriesTable = pgTable("categories", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	created_at: timestamp().notNull().defaultNow(),

	title: varchar({ length: 255 }).notNull(),
	popularity: integer().notNull().default(0),
});

export const commentsTable = pgTable("comments", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	author_id: integer().notNull(),
	post_id: integer().notNull(),
	created_at: timestamp().notNull().defaultNow(),

	content: varchar({ length: 255 }).notNull(),
	all_likes: integer().array().notNull().default([]),
});

/**
 * Messages Schema
 */

export const conversationsTable = pgTable("conversations", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	created_at: timestamp().notNull().defaultNow(),
	updated_at: timestamp().notNull().defaultNow(),
});

export const participantsTable = pgTable("participants", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	profile_id: integer().notNull(),
	conversation_id: integer().notNull(),
	added_at: timestamp().notNull().defaultNow(),
});

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

/**
 * Notifications Schema
 */

export const notificationsTable = pgTable("notifications", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	author_id: integer().notNull(),
	created_at: timestamp().notNull().defaultNow(),

	content: varchar({ length: 255 }).notNull(),
	type: varchar({ length: 255 }).notNull(),
	is_read: boolean().notNull().default(false),
});

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

export const privacySettingsTable = pgTable("privacy_settings", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	user_id: integer().notNull(),
	created_at: timestamp().notNull().defaultNow(),
	updated_at: timestamp().notNull().defaultNow(),

	is_verified: boolean().notNull().default(false),
	is_public: boolean().notNull().default(false),
	show_active: boolean().notNull().default(false),
});




