import { db } from "@config/db";
import { queryDB } from "@/utils/query-db";

export const QUERIES = {
	fetchUsers: async function () {
		return queryDB(async () => {
			const result = await db.collection("users").find({}).toArray();
			return result;
		});
	},
	fetchUserWithId: async function (id: number) {
		return queryDB(async () => {
			const result = await db.collection("users").findOne({ id: id });
			return result;
		});
	},
	fetchUserWithGoogleUid: async function (uid: string) {
		return queryDB(async () => {
			const result = await db.collection("users").findOne({ google_uid: uid });
			return result;
		});
	},
};

export const MUTATIONS = {
	createUser: async function (uid: string) {
		return queryDB(async (db) => {
			const user = {
				google_uid: uid,
				last_login: new Date().toISOString()
			}
			const result = await db.collection("users").insertOne(user);
			return result;
		});
	},
	deleteUserWithId: async function (id: number) {
		return queryDB(async (db) => {
			const result = await db.collection("users").deleteOne({ id: id });
			return result;
		});
	},
	deleteUserGoogleUid: async function (uid: string) {
		return queryDB(async (db) => {
			const result = await db.collection("users").deleteOne({ google_uid: uid });
			return result;
		});
	},
};