import { eq } from "drizzle-orm";

import { db } from "@config/db";
import { queryDB } from "@/utils/try-catch";

import {
	InsertNotification,
	SelectNotification,
	notificationsTable as NOTIFICATIONS_TABLE,
} from "@/db/schema";

export const QUERIES = {
	fetchNotifications: async function () {
		return queryDB(async () => {
			const result = await db
				.select()
				.from(NOTIFICATIONS_TABLE);

			return result;
		});
	},
	fetchSomeNotifications: async function (
		page: number = 1,
		pageSize: number = 5,
	) {
		const result = await db
			.select()
			.from(NOTIFICATIONS_TABLE)
			.limit(pageSize)
			.offset((page - 1) * pageSize);

		return result;
	},
	fetchNotificationsWithUserId: async function (user_id: SelectNotification["recipient_id"]) {
		return queryDB(async () => {
			const result = await db
				.select()
				.from(NOTIFICATIONS_TABLE)
				.where(eq(NOTIFICATIONS_TABLE.recipient_id, user_id));

			return result;
		});
	},
	fetchSomeNotificationsWithUserId: async function (
		user_id: SelectNotification["recipient_id"],
		page: number = 1,
		pageSize: number = 5,
	) {
		return queryDB(async () => {
			const result = await db
				.select()
				.from(NOTIFICATIONS_TABLE)
				.where(eq(NOTIFICATIONS_TABLE.recipient_id, user_id))
				.limit(pageSize)
				.offset((page - 1) * pageSize);

			return result;
		});
	},
};

export const MUTATIONS = {
	createNotification: async function (
		author_id: InsertNotification["author_id"],
		recipient_id: InsertNotification["recipient_id"],
		content: InsertNotification["content"],
		type: InsertNotification["type"],
	) {
		return queryDB(async () => {
			const data: InsertNotification = {
				author_id,
				recipient_id,
				content,
				type,
			}

			const result = await db
				.insert(NOTIFICATIONS_TABLE)
				.values(data);

			return result;
		});
	},
	updateNotificationReadWithId: async function (id: SelectNotification["id"]) {
		return queryDB(async () => {
			const data: Partial<SelectNotification> = {
				is_read: true,
			}

			const result = await db
				.update(NOTIFICATIONS_TABLE)
				.set(data)
				.where(eq(NOTIFICATIONS_TABLE.id, id));

			return result;
		});
	},
	deleteNotificationWithId: async function (id: SelectNotification["id"]) {
		return queryDB(async () => {
			const result = await db
				.delete(NOTIFICATIONS_TABLE)
				.where(eq(NOTIFICATIONS_TABLE.id, id));

			return result;
		});
	},
};