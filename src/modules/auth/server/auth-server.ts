import { eq } from "drizzle-orm";

import { db } from "@config/db";
import { queryDB } from "@/utils/try-catch";
import {
	InsertUser,
	SelectUser,
	usersTable as USERS_TABLE,
} from "@/db/schema";

export const QUERIES = {
	fetchUsers: async function () {
		return queryDB(async () => {
			const result = await db
				.select()
				.from(USERS_TABLE);

			return result;
		});
	},
	fetchUserWithId: async function (id: SelectUser["id"]) {
		return queryDB(async () => {
			const result = await db
				.select()
				.from(USERS_TABLE)
				.where(eq(USERS_TABLE.id, id));

			return result;
		});
	},
	fetchUserWithUid: async function (uid: SelectUser["google_uid"]) {
		return queryDB(async () => {
			const result = await db
				.select()
				.from(USERS_TABLE)
				.where(eq(USERS_TABLE.google_uid, uid));

			return result;
		});
	},
};

export const MUTATIONS = {
	createUser: async function (uid: InsertUser["google_uid"]) {
		return queryDB(async () => {
			const data: InsertUser = {
				google_uid: uid,
				type: "regular",
			}

			const result = await db
				.insert(USERS_TABLE)
				.values(data);

			return result;
		});
	},
	deleteUserWithId: async function (id: SelectUser["id"]) {
		return queryDB(async () => {
			const result = await db
				.delete(USERS_TABLE)
				.where(eq(USERS_TABLE.id, id));

			return result;
		});
	},
	deleteUserGoogleUid: async function (uid: SelectUser["google_uid"]) {
		return queryDB(async () => {
			const result = await db
				.delete(USERS_TABLE)
				.where(eq(USERS_TABLE.google_uid, uid));

			return result;
		});
	},
};