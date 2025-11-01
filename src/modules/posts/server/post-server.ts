import { eq, desc, sql } from "drizzle-orm";

import { db } from "@config/db";
import { queryDB } from "@/utils/try-catch";

import {
	InsertPost,
	SelectPost,
	postsTable as POSTS_TABLE,
	SelectTag,
	tagsTable as TAGS_TABLE,
	SelectCategory,
	categoriesTable as CATEGORIES_TABLE,
} from "@/db/schema";

export const QUERIES = {
	fetchPosts: async function () {
		return queryDB(async () => {
			const result = await db
				.select()
				.from(POSTS_TABLE)
				.orderBy(desc(POSTS_TABLE.created_at));

			return result;
		});
	},
	fetchSomePosts: async function (
		page: number = 1,
		pageSize: number = 5,
	) {
		return queryDB(async () => {
			const result = await db
				.select()
				.from(POSTS_TABLE)
				.orderBy(desc(POSTS_TABLE.created_at))
				.limit(pageSize)
				.offset((page - 1) * pageSize);

			return result;
		});
	},
	fetchAllPostsWithAuthorId: async function (author_id: SelectPost["author_id"]) {
		return queryDB(async () => {
			const result = await db
				.select()
				.from(POSTS_TABLE)
				.where(eq(POSTS_TABLE.author_id, author_id))
				.orderBy(desc(POSTS_TABLE.created_at));

			return result;
		});
	},
	fetchSomePostsWithAuthorId: async function (
		author_id: SelectPost["author_id"],
		page: number = 1,
		pageSize: number = 5,
	) {
		return queryDB(async () => {
			const result = await db
				.select()
				.from(POSTS_TABLE)
				.where(eq(POSTS_TABLE.author_id, author_id))
				.orderBy(desc(POSTS_TABLE.created_at))
				.limit(pageSize)
				.offset((page - 1) * pageSize);

			return result;
		});
	},
	fetchTags: async function () {
		return queryDB(async () => {
			const result = await db
				.select({
					id: TAGS_TABLE.id,
					category_id: TAGS_TABLE.category_id,
					created_at: TAGS_TABLE.created_at,
					title: TAGS_TABLE.title,
					popularity: sql<number>`count(${POSTS_TABLE.id})`.as('popularity')
				})
				.from(TAGS_TABLE)
				.leftJoin(
					POSTS_TABLE,
					sql`${POSTS_TABLE.all_tags} @> ARRAY[${TAGS_TABLE.id}]::integer[]`
				)
				.groupBy(TAGS_TABLE.id)
				.orderBy(desc(sql`count(${POSTS_TABLE.id})`));

			return result;
		});
	},
	fetchTagWithId: async function (id: SelectTag["id"]) {
		return queryDB(async () => {
			const result = await db
				.select()
				.from(TAGS_TABLE)
				.where(eq(TAGS_TABLE.id, id))
				.limit(1);

			return result;
		});
	},
	fetchTrendingTags: async function () {
		return queryDB(async () => {
			const result = await db
				.select({
					id: TAGS_TABLE.id,
					category_id: TAGS_TABLE.category_id,
					created_at: TAGS_TABLE.created_at,
					title: TAGS_TABLE.title,
					popularity: sql<number>`count(${POSTS_TABLE.id})`.as('popularity')
				})
				.from(TAGS_TABLE)
				.leftJoin(
					POSTS_TABLE,
					sql`${POSTS_TABLE.all_tags} @> ARRAY[${TAGS_TABLE.id}]::integer[]`
				)
				.groupBy(TAGS_TABLE.id)
				.orderBy(desc(sql`count(${POSTS_TABLE.id})`))
				.limit(5);

			return result;
		});
	},
	fetchCategoryById: async function (id: SelectCategory["id"]) {
		return queryDB(async () => {
			const result = await db
				.select()
				.from(CATEGORIES_TABLE)
				.where(eq(CATEGORIES_TABLE.id, id))
				.limit(1);

			return result;
		});
	},
	fetchTrendingCategories: async function () {
		return queryDB(async () => {
			const result = await db
				.select({
					id: CATEGORIES_TABLE.id,
					created_at: CATEGORIES_TABLE.created_at,
					title: CATEGORIES_TABLE.title,
					popularity: sql<number>`count(distinct ${POSTS_TABLE.id})`.as('popularity')
				})
				.from(CATEGORIES_TABLE)
				.leftJoin(
					TAGS_TABLE,
					eq(TAGS_TABLE.category_id, CATEGORIES_TABLE.id)
				)
				.leftJoin(
					POSTS_TABLE,
					sql`${POSTS_TABLE.all_tags} @> ARRAY[${TAGS_TABLE.id}]::integer[]`
				)
				.groupBy(CATEGORIES_TABLE.id)
				.orderBy(desc(sql`count(distinct ${POSTS_TABLE.id})`))
				.limit(4);

			return result;
		});
	},
};

export const MUTATIONS = {
	createPost: async function (
		author_id: InsertPost["author_id"],
		content: InsertPost["content"],
		args: Object,
	) {
		return queryDB(async () => {
			const cleanArgs = Object.fromEntries(
				Object.entries(args).filter(([_, value]) => value !== undefined)
			);

			const data: InsertPost = {
				author_id,
				content,
				...cleanArgs,
			}

			const result = await db
				.insert(POSTS_TABLE)
				.values(data);

			return result;
		});
	},
	updatePostWithId: async function (
		id: SelectPost["id"],
		updates: Object,
	) {
		return queryDB(async () => {
			const cleanUpdates = Object.fromEntries(
				Object.entries(updates).filter(([_, value]) => value !== undefined)
			);

			const data: Partial<SelectPost> = {
				...cleanUpdates,
			}

			const result = await db
				.update(POSTS_TABLE)
				.set(data)
				.where(eq(POSTS_TABLE.id, id));

			return result;
		});
	},
	deletePostWithId: async function (id: SelectPost["id"]) {
		return queryDB(async () => {
			const result = await db
				.delete(POSTS_TABLE)
				.where(eq(POSTS_TABLE.id, id));

			return result;
		});
	},
};