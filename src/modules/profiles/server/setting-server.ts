import { eq } from "drizzle-orm";

import { db } from "@config/db";
import { queryDB } from "@/utils/try-catch";
import {
	InsertNotificationSettings,
	SelectNotificationSettings,
	notificationSettingsTable as NOTIFICATIONS_SETTINGS_TABLE,
	InsertPrivacySettings,
	SelectPrivacySettings,
	privacySettingsTable as PRIVACY_SETTINGS_TABLE,
} from "@/db/schema";

export const QUERIES = {
	fetchNotificationSettingsWithUserId: async function (user_id: SelectNotificationSettings["user_id"]) {
		return queryDB(async () => {
			const result = await db
				.select()
				.from(NOTIFICATIONS_SETTINGS_TABLE)
				.where(eq(NOTIFICATIONS_SETTINGS_TABLE.user_id, user_id));

			return result;
		});
	},
	fetchPrivacySettingsWithUserId: async function (user_id: SelectPrivacySettings["user_id"]) {
		return queryDB(async () => {
			const result = await db
				.select()
				.from(PRIVACY_SETTINGS_TABLE)
				.where(eq(PRIVACY_SETTINGS_TABLE.user_id, user_id));

			return result;
		});
	},
};

export const MUTATIONS = {
	createNotificationSettingsWithUserId: async function (user_id: InsertNotificationSettings["user_id"]) {
		return queryDB(async () => {
			const data: InsertNotificationSettings = {
				user_id,
				notify_likes: false,
				notify_comments: false,
				notify_follows: false,
				notify_messages: false,
			}

			const result = await db
				.insert(NOTIFICATIONS_SETTINGS_TABLE)
				.values(data);

			return result;
		});
	},
	createPrivacySettingsWithUserId: async function (user_id: InsertPrivacySettings["user_id"]) {
		return queryDB(async () => {
			const data: InsertPrivacySettings = {
				user_id,
				is_verified: false,
				is_public: false,
				show_active: false,
			}

			const result = await db
				.insert(PRIVACY_SETTINGS_TABLE)
				.values(data);

			return result;
		});
	},
	updateNotificationSettingsWithUserId: async function (
		user_id: SelectNotificationSettings["user_id"],
		updates: Object,
	) {
		return queryDB(async () => {
			const cleanUpdates = Object.fromEntries(
				Object.entries(updates).filter(([_, value]) => value !== undefined)
			);

			const data: Partial<SelectNotificationSettings> = {
				...cleanUpdates,
			}

			const result = await db
				.update(NOTIFICATIONS_SETTINGS_TABLE)
				.set(data)
				.where(eq(NOTIFICATIONS_SETTINGS_TABLE.user_id, user_id));

			return result;
		});
	},
	updatePrivacySettingsWithUserId: async function (
		user_id: SelectPrivacySettings["user_id"],
		updates: Object,
	) {
		return queryDB(async () => {
			const cleanUpdates = Object.fromEntries(
				Object.entries(updates).filter(([_, value]) => value !== undefined)
			);

			const data: Partial<SelectPrivacySettings> = {
				...cleanUpdates,
			}

			const result = await db
				.update(PRIVACY_SETTINGS_TABLE)
				.set(data)
				.where(eq(PRIVACY_SETTINGS_TABLE.user_id, user_id));

			return result;
		});
	},
	deleteNotificationSettingsWithUserId: async function (user_id: SelectNotificationSettings["user_id"],) {
		return queryDB(async () => {
			const result = await db
				.delete(NOTIFICATIONS_SETTINGS_TABLE)
				.where(eq(NOTIFICATIONS_SETTINGS_TABLE.user_id, user_id));

			return result;
		});
	},
	deletePrivacySettingsWithUserId: async function (user_id: SelectPrivacySettings["user_id"],) {
		return queryDB(async () => {
			const result = await db
				.delete(PRIVACY_SETTINGS_TABLE)
				.where(eq(PRIVACY_SETTINGS_TABLE.user_id, user_id));

			return result;
		});
	},
};