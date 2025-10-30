import { eq, ne, and, not, arrayContains } from "drizzle-orm";

import { db } from "@config/db";
import { queryDB } from "@/utils/try-catch";

import {
	InsertProfile,
	SelectProfile,
	profilesTable as PROFILES_TABLE,
} from "@/db/schema";

export const QUERIES = {
	fetchProfiles: async function () {
		return queryDB(async () => {
			const result = await db
				.select()
				.from(PROFILES_TABLE);

			return result;
		});
	},
	fetchSomeProfiles: async function (
		page: number = 1,
		pageSize: number = 5,
	) {
		return queryDB(async () => {
			const result = await db
				.select()
				.from(PROFILES_TABLE)
				.limit(pageSize)
				.offset((page - 1) * pageSize);

			return result;
		});
	},
	fetchProfileWithId: async function (id: SelectProfile["id"]) {
		return queryDB(async () => {
			const result = await db
				.select()
				.from(PROFILES_TABLE)
				.where(eq(PROFILES_TABLE.id, id))
				.limit(1);

			return result;
		});
	},
	fetchProfileWithUserId: async function (user_id: SelectProfile["user_id"]) {
		return queryDB(async () => {
			const result = await db
				.select()
				.from(PROFILES_TABLE)
				.where(eq(PROFILES_TABLE.user_id, user_id))
				.limit(1);

			return result;
		});
	},
	fetchProfileWithUsername: async function (username: SelectProfile["username"]) {
		return queryDB(async () => {
			const result = await db
				.select()
				.from(PROFILES_TABLE)
				.where(eq(PROFILES_TABLE.username, username))
				.limit(1);

			return result;
		});
	},
	fetchSomeSuggestedProfiles: async function (
		user_id: SelectProfile["user_id"],
		page: number = 1,
		pageSize: number = 5,
	) {
		return queryDB(async () => {
			const result = await db
				.select()
				.from(PROFILES_TABLE)
				.where(
					and(
						ne(PROFILES_TABLE.user_id, user_id),
						not(arrayContains(PROFILES_TABLE.all_followers, [user_id]))
					)
				)
				.limit(pageSize)
				.offset((page - 1) * pageSize);

			return result;
		});
	},
	fetchAllSuggestedProfiles: async function (user_id: SelectProfile["user_id"]) {
		return queryDB(async () => {
			const result = await db
				.select()
				.from(PROFILES_TABLE)
				.where(
					and(
						ne(PROFILES_TABLE.user_id, user_id),
						not(arrayContains(PROFILES_TABLE.all_followers, [user_id]))
					)
				);

			return result;
		});
	},
};

export const MUTATIONS = {
	createProfile: async function (
		user_id: InsertProfile["user_id"],
		first_name: InsertProfile["first_name"],
		last_name: InsertProfile["last_name"],
		avatar_url: InsertProfile["avatar_url"],
	) {
		return queryDB(async () => {
			const data: InsertProfile = {
				user_id,
				first_name,
				last_name,
				avatar_url: avatar_url ?? null,
				username: `newuser-${Math.random().toString(36).substring(7)}`,
				bio: 'I am new, please be nice!',
			}

			const result = await db
				.insert(PROFILES_TABLE)
				.values(data);

			return result;
		});
	},
	updateProfileWithUserId: async function (
		user_id: SelectProfile["user_id"],
		updates: Object
	) {
		return queryDB(async () => {
			const cleanUpdates = Object.fromEntries(
				Object.entries(updates).filter(([_, value]) => value !== undefined && value !== "")
			);

			const data: Partial<SelectProfile> = {
				...cleanUpdates,
				...(cleanUpdates.birth_date && {
					birth_date: new Date(cleanUpdates.birth_date)
				})
			};

			const result = await db
				.update(PROFILES_TABLE)
				.set(data)
				.where(eq(PROFILES_TABLE.user_id, user_id));
			return result;
		});
	},
	updateProfileAvatarWithUserId: async function (
		user_id: SelectProfile["user_id"],
		avatar_url: SelectProfile["avatar_url"]
	) {
		return queryDB(async () => {
			const data: Partial<SelectProfile> = {
				avatar_url,
			}

			const result = await db
				.update(PROFILES_TABLE)
				.set(data)
				.where(eq(PROFILES_TABLE.user_id, user_id));

			return result;
		});
	},
	updateProfileCoverWithUserId: async function (
		user_id: SelectProfile["user_id"],
		cover_url: SelectProfile["cover_url"]
	) {
		return queryDB(async () => {
			const data: Partial<SelectProfile> = {
				cover_url,
			}

			const result = await db
				.update(PROFILES_TABLE)
				.set(data)
				.where(eq(PROFILES_TABLE.user_id, user_id));

			return result;
		});
	},
	deleteProfileWithUserId: async function (user_id: SelectProfile["user_id"],) {
		return queryDB(async () => {
			const result = await db
				.delete(PROFILES_TABLE)
				.where(eq(PROFILES_TABLE.user_id, user_id));

			return result;
		});
	},
};