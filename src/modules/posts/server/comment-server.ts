import { eq } from "drizzle-orm";

import { db } from "@config/db";
import { queryDB } from "@/utils/try-catch";

import {
	InsertComment,
	SelectComment,
	commentsTable as COMMENTS_TABLE,
} from "@/db/schema";

export const QUERIES = {
	fetchCommentsWithPostId: async function (post_id: SelectComment["post_id"]) {
		return queryDB(async () => {
			const result = await db
				.select()
				.from(COMMENTS_TABLE)
				.where(eq(COMMENTS_TABLE.post_id, post_id));

			return result;
		});
	},
	fetchSomeCommentsWithPostId: async function (
		post_id: SelectComment["post_id"],
		page: number = 1,
		pageSize: number = 5,
	) {
		return queryDB(async () => {
			const result = await db
				.select()
				.from(COMMENTS_TABLE)
				.where(eq(COMMENTS_TABLE.post_id, post_id))
				.limit(pageSize)
				.offset((page - 1) * pageSize);

			return result;
		});
	},
};

export const MUTATIONS = {
	createComment: async function (
		post_id: InsertComment["post_id"],
		author_id: InsertComment["author_id"],
		content: InsertComment["content"],
	) {
		return queryDB(async () => {
			const data: InsertComment = {
				post_id,
				author_id,
				content,
			};

			const result = await db
				.insert(COMMENTS_TABLE)
				.values(data);

			return result;
		});
	},
	updateCommentWithId: async function (
		id: SelectComment["id"],
		updates: Object
	) {
		return queryDB(async () => {
			const cleanUpdates = Object.fromEntries(
				Object.entries(updates).filter(([_, value]) => value !== undefined)
			);

			const data: Partial<SelectComment> = {
				...cleanUpdates,
			}

			const result = await db
				.update(COMMENTS_TABLE)
				.set(data)
				.where(eq(COMMENTS_TABLE.id, id));

			return result;
		});
	},
	deleteCommentWithId: async function (id: SelectComment["id"]) {
		return queryDB(async () => {
			const result = await db
				.delete(COMMENTS_TABLE)
				.where(eq(COMMENTS_TABLE.id, id));

			return result;
		});
	},
};