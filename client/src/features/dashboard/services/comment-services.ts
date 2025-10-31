import { BASE_URL } from "@/main";
import { tryCatch, type Result } from "@/lib/try-catch";

import type { CommentProp } from "@/features/dashboard/types/dashboard-types";

/**
 * Controller
 */

export const CONTROLLER = {
	/**
	 * Creates a new comment
	 * @param post_id 
	 * @param author_id 
	 * @param content 
	 * @returns boolean
	 */
	CreateNewComment: async function (
		post_id: number,
		author_id: number,
		content: string,
	): Promise<boolean> {
		if (!post_id) throw new Error("No Post ID Found");

		if (!author_id) throw new Error("No Author ID Found");

		if (!content) throw new Error("Content is Needed");

		const [comment, error] = await MUTATIONS.createComment(post_id, author_id, content);

		if (error) throw new Error('Error creating comment:', error);
		if (!comment) return false;

		return true;
	},
	/**
	 * Fetches all comments with the given post ID
	 * @param post_id 
	 * @returns Result<CommentProp[]>
	 */
	FetchAllCommentsWithPostId: async function (post_id: number): Promise<CommentProp[]> {
		if (!post_id) throw new Error("No Unique Identifier");

		const [comments, error] = await QUERIES.fetchAllCommentsWithPostId(post_id);

		if (error) throw new Error('Error fetching comments:', error);
		if (!comments) return [];

		return comments;
	},
	/**
	 * Fetches some comments with the given post ID
	 * @param post_id 
	 * @param page 
	 * @param pageSize 
	 * @returns Result<CommentProp[]>
	 */
	FetchSomeCommentsWithPostId: async function (
		post_id: number,
		page: number,
		pageSize: number,
	): Promise<CommentProp[]> {
		if (!post_id) throw new Error("No Unique Identifier");

		const [comments, error] = await QUERIES.fetchSomeCommentsWithPostId(post_id, page, pageSize);

		if (error) throw new Error('Error fetching comments:', error);
		if (!comments) return [];

		return comments;
	},
	/**
	 * Updates a comment with the given ID
	 * @param id 
	 * @param updates 
	 * @returns boolean
	 */
	UpdateCommentWithId: async function (
		id: number,
		updates: object,
	): Promise<boolean> {
		if (!id) throw new Error("No Comment ID Found");

		if (!updates) throw new Error("No Updates Found");

		const [comment, error] = await MUTATIONS.updateCommentWithId(id, updates);

		if (error) throw new Error('Error updating comment:', error);
		if (!comment) return false;

		return true;
	},
	/**
	 * Deletes a comment with the given ID
	 * @param id 
	 * @returns boolean
	 */
	DeleteCommentWithId: async function (id: number): Promise<boolean> {
		if (!id) throw new Error("No Comment ID Found");

		const [comment, error] = await MUTATIONS.deleteCommentWithId(id);

		if (error) throw new Error('Error deleting comment:', error);
		if (!comment) return false;

		return true;
	},
};

/**
 * Queries
 */

export const QUERIES = {
	fetchAllCommentsWithPostId: async function (post_id: number): Promise<Result<CommentProp[]>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/comment/fetch-all/${post_id}`, {
					method: "GET",
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Fetch Comments
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let result: CommentProp[] = [];

				if (data.status === true && data.data) result = data.data;

				return result;
			})()
		);
	},
	fetchSomeCommentsWithPostId: async function (
		post_id: number,
		page: number,
		pageSize: number,
	): Promise<Result<CommentProp[]>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/comment/fetch-some/${post_id}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						page,
						pageSize,
					}),
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Fetch Comments
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let result: CommentProp[] = [];

				if (data.status === true && data.data) result = data.data;

				return result;
			})()
		);
	},
};

/**
 * Mutations
 */

export const MUTATIONS = {
	createComment: async function (
		post_id: number,
		author_id: number,
		content: string
	): Promise<Result<boolean>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/comment/create`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						post_id,
						author_id,
						content,
					}),
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Create Comment
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				return true;
			})()
		);
	},
	updateCommentWithId: async function (
		id: number,
		updates: object,
	): Promise<Result<boolean>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/comment/update/${id}`, {
					method: "PUT",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						updates
					}),
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Update Comment
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				return true;
			})()
		);
	},
	deleteCommentWithId: async function (id: number,): Promise<Result<boolean>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/comment/delete/${id}`, {
					method: "DELETE",
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Delete Comment
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				return true;
			})()
		);
	},
};