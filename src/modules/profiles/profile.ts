import { queryDB } from "@/utils/query-db";

export const QUERIES = {
	fetchProfiles: async function () {
		return queryDB(async (db) => {
			const result = await db.collection("profiles").find({}).toArray();
			return result;
		});
	},
	fetchProfileWithId: async function (id: number) {
		return queryDB(async (db) => {
			const result = await db.collection("profiles").findOne({ id });
			return result;
		});
	},
	fetchProfileWithUserId: async function (user_id: number) {
		return queryDB(async (db) => {
			const result = await db.collection("profiles").findOne({ user_id });
			return result;
		});
	},
	fetchProfileWithUsername: async function (username: string) {
		return queryDB(async (db) => {
			const result = await db.collection("profiles").find({ username }).toArray();
			return result;
		});
	},
};

export const MUTATIONS = {
	createProfile: async function (
		user_id: number,
		avatar_url: string | null,
		args: Object
	) {
		return queryDB(async (db) => {
			const cleanArgs = Object.fromEntries(
				Object.entries(args).filter(([_, value]) => value !== undefined)
			);
			const result = await db.collection("profiles").insertOne({
				...cleanArgs,
				user_id,
				avatar_url,
			});
			return result;
		});
	},
	updateProfileWithUserId: async function (
		user_id: number,
		updates: Object
	) {
		return queryDB(async (db) => {
			const cleanUpdates = Object.fromEntries(
				Object.entries(updates).filter(([_, value]) => value !== undefined)
			);
			const result = await db.collection("profiles").updateOne({ user_id }, cleanUpdates);
			return result;
		});
	},
	updateProfileAvatarWithUserId: async function (
		user_id: number,
		avatar_url: string
	) {
		return queryDB(async (db) => {
			const result = await db.collection("profiles").updateOne({ user_id }, {
				avatar_url
			});
			return result;
		});
	},
	updateProfileCoverWithUserId: async function (
		user_id: number,
		cover_url: string
	) {
		return queryDB(async (db) => {
			const result = await db.collection("profiles").updateOne({ user_id }, {
				cover_url
			});
			return result;
		});
	},
	deleteProfileWithUserId: async function (user_id: number) {
		return queryDB(async (db) => {
			const result = await db.collection("profiles").deleteOne({ user_id });
			return result;
		});
	},
};