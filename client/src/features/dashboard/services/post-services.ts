import { BASE_URL } from "@/main";
import { tryCatch, type Result } from "@/lib/try-catch";

import type {
	CategoryProp,
	PostProp,
	TagProp
} from "@/features/dashboard/types/dashboard-types";
import type {
	MediaProp,
} from "@/features/personalization/types/profile-types";
import {
	CONTROLLER as COMMENT_CONTROLLER
} from "@/features/dashboard/services/comment-services";
import {
	CONTROLLER as PROFILE_CONTROLLER
} from "@/features/personalization/services/profile-services";

/**
 * Controller
 */

export const CONTROLLER = {
	/**
	 * Creates a new post
	 * @param author_id 
	 * @param content 
	 * @param args 
	 * @returns boolean
	 */
	CreateNewPost: async function (
		author_id: number,
		content: string,
		args: Object
	): Promise<boolean> {
		if (!author_id) throw new Error("No Unique Identifier Found");

		if (!content) throw new Error("Content is Needed");

		const [post, error] = await MUTATIONS.createPost(author_id, content, args);

		if (error) throw new Error('Error creating post:', error);
		if (!post) return false;

		return true;
	},
	/**
	 * Uploads post images to the bucket
	 * @param author_id 
	 * @param uploads 
	 * @returns string[]
	 */
	UploadPostImages: async function (
		author_id: number,
		uploads: MediaProp[]
	): Promise<string[]> {
		if (!author_id) throw new Error("No Unique Identifier");

		if (!uploads) throw new Error("No Uploads Found");

		const urls: string[] = await Promise.all(
			uploads.map(async (upload) => {
				const url = await PROFILE_CONTROLLER.UploadImageToBucket(author_id, upload);
				return url;
			})
		);

		const filteredUrls = urls.filter(url => url !== "");

		return filteredUrls;
	},
	/**
	 * Fetches all posts
	 * @returns PostProp[]
	 */
	FetchAllPosts: async function (): Promise<PostProp[]> {
		const [posts, error] = await QUERIES.fetchAllPosts();

		if (error) throw new Error('Error fetching posts:', error);
		if (!posts) return [];

		const result: PostProp[] = await Promise.all(
			posts.map(async (post) => {
				const { id, author_id } = post;
				let setPost: PostProp = post;

				const profile = await PROFILE_CONTROLLER.FetchProfileWithUserId(author_id);
				if (profile) setPost = { ...setPost, author: profile };

				const comments = await COMMENT_CONTROLLER.FetchAllCommentsWithPostId(id);
				if (comments) setPost = { ...setPost, comments };

				if (post.all_tags && post.all_tags.length > 0) {
					const tags: TagProp[] = (await Promise.all(
						post.all_tags.map(async (tag_id) => {
							const tag = await CONTROLLER.FetchTagWithId(tag_id);
							return tag;
						})
					)).filter((tag): tag is TagProp => tag !== undefined);

					if (tags.length > 0) setPost = { ...setPost, tags };
				}

				return setPost;
			})
		);

		return result;
	},
	/**
	 * Fetches some posts
	 * @param page 
	 * @param pageSize 
	 * @returns PostProp[]
	 */
	FetchSomePosts: async function (page: number, pageSize: number): Promise<PostProp[]> {
		const [posts, error] = await QUERIES.fetchSomePosts(page, pageSize);

		if (error) throw new Error('Error fetching posts:', error);
		if (!posts) return [];

		const result: PostProp[] = await Promise.all(
			posts.map(async (post) => {
				const { id, author_id } = post;
				let setPost: PostProp = post;

				const profile = await PROFILE_CONTROLLER.FetchProfileWithUserId(author_id);
				if (profile) setPost = { ...setPost, author: profile };

				const comments = await COMMENT_CONTROLLER.FetchAllCommentsWithPostId(id);
				if (comments) setPost = { ...setPost, comments };

				if (post.all_tags && post.all_tags.length > 0) {
					const tags: TagProp[] = (await Promise.all(
						post.all_tags.map(async (tag_id) => {
							const tag = await CONTROLLER.FetchTagWithId(tag_id);
							return tag;
						})
					)).filter((tag): tag is TagProp => tag !== undefined);

					if (tags.length > 0) setPost = { ...setPost, tags };
				}

				return setPost;
			})
		);

		return result;
	},
	/**
	 * Fetches all posts with the given author ID
	 * @param author_id 
	 * @returns PostProp[]
	 */
	FetchAllPostsWithAuthorId: async function (author_id: number): Promise<PostProp[]> {
		const [posts, error] = await QUERIES.fetchAllPostsWithAuthorId(author_id);

		if (error) throw new Error('Error fetching posts:', error);
		if (!posts) return [];

		const result: PostProp[] = await Promise.all(
			posts.map(async (post) => {
				const { id, author_id } = post;
				let setPost: PostProp = post;

				const profile = await PROFILE_CONTROLLER.FetchProfileWithUserId(author_id);
				if (profile) setPost = { ...setPost, author: profile };

				const comments = await COMMENT_CONTROLLER.FetchAllCommentsWithPostId(id);
				if (comments) setPost = { ...setPost, comments };

				if (post.all_tags && post.all_tags.length > 0) {
					const tags: TagProp[] = (await Promise.all(
						post.all_tags.map(async (tag_id) => {
							const tag = await CONTROLLER.FetchTagWithId(tag_id);
							return tag;
						})
					)).filter((tag): tag is TagProp => tag !== undefined);

					if (tags.length > 0) setPost = { ...setPost, tags };
				}

				return setPost;
			})
		);

		return result;
	},
	/**
	 * Fetches some posts with the given author ID
	 * @param author_id 
	 * @param page 
	 * @param pageSize 
	 * @returns PostProp[]
	 */
	FetchSomePostsWithAuthorId: async function (
		author_id: number,
		page: number,
		pageSize: number
	): Promise<PostProp[]> {
		const [posts, error] = await QUERIES.fetchSomePostsWithAuthorId(author_id, page, pageSize);

		if (error) throw new Error('Error fetching posts:', error);
		if (!posts) return [];

		const result: PostProp[] = await Promise.all(
			posts.map(async (post) => {
				const { id, author_id } = post;
				let setPost: PostProp = post;

				const profile = await PROFILE_CONTROLLER.FetchProfileWithUserId(author_id);
				if (profile) setPost = { ...setPost, author: profile };

				const comments = await COMMENT_CONTROLLER.FetchAllCommentsWithPostId(id);
				if (comments) setPost = { ...setPost, comments };

				if (post.all_tags && post.all_tags.length > 0) {
					const tags: TagProp[] = (await Promise.all(
						post.all_tags.map(async (tag_id) => {
							const tag = await CONTROLLER.FetchTagWithId(tag_id);
							return tag;
						})
					)).filter((tag): tag is TagProp => tag !== undefined);

					if (tags.length > 0) setPost = { ...setPost, tags };
				}

				return setPost;
			})
		);

		return result;
	},
	/**
	 * Fetches all media posts with the given author ID
	 * @param author_id 
	 * @returns PostProp[]
	 */
	FetchAllMediaPostsWithAuthorId: async function (author_id: number): Promise<PostProp[]> {
		const [posts, error] = await QUERIES.fetchAllMediaPostsWithAuthorId(author_id);

		if (error) throw new Error('Error fetching posts:', error);
		if (!posts) return [];

		const result: PostProp[] = await Promise.all(
			posts.map(async (post) => {
				const { id, author_id } = post;
				let setPost: PostProp = post;

				const profile = await PROFILE_CONTROLLER.FetchProfileWithUserId(author_id);
				if (profile) setPost = { ...setPost, author: profile };

				const comments = await COMMENT_CONTROLLER.FetchAllCommentsWithPostId(id);
				if (comments) setPost = { ...setPost, comments };

				if (post.all_tags && post.all_tags.length > 0) {
					const tags: TagProp[] = (await Promise.all(
						post.all_tags.map(async (tag_id) => {
							const tag = await CONTROLLER.FetchTagWithId(tag_id);
							return tag;
						})
					)).filter((tag): tag is TagProp => tag !== undefined);

					if (tags.length > 0) setPost = { ...setPost, tags };
				}

				return setPost;
			})
		);

		return result;
	},
	/**
	 * Fetches some media posts with the given author ID
	 * @param author_id 
	 * @param page 
	 * @param pageSize 
	 * @returns PostProp[]
	 */
	FetchSomeMediaPostsWithAuthorId: async function (
		author_id: number,
		page: number,
		pageSize: number
	): Promise<PostProp[]> {
		const [posts, error] = await QUERIES.fetchSomeMediaPostsWithAuthorId(author_id, page, pageSize);

		if (error) throw new Error('Error fetching posts:', error);
		if (!posts) return [];

		const result: PostProp[] = await Promise.all(
			posts.map(async (post) => {
				const { id, author_id } = post;
				let setPost: PostProp = post;

				const profile = await PROFILE_CONTROLLER.FetchProfileWithUserId(author_id);
				if (profile) setPost = { ...setPost, author: profile };

				const comments = await COMMENT_CONTROLLER.FetchAllCommentsWithPostId(id);
				if (comments) setPost = { ...setPost, comments };

				if (post.all_tags && post.all_tags.length > 0) {
					const tags: TagProp[] = (await Promise.all(
						post.all_tags.map(async (tag_id) => {
							const tag = await CONTROLLER.FetchTagWithId(tag_id);
							return tag;
						})
					)).filter((tag): tag is TagProp => tag !== undefined);

					if (tags.length > 0) setPost = { ...setPost, tags };
				}

				return setPost;
			})
		);

		return result;
	},
	/**
	 * Fetches all saved posts with the given author ID
	 * @param author_id 
	 * @returns PostProp[]
	 */
	FetchAllSavedPostsWithAuthorId: async function (author_id: number): Promise<PostProp[]> {
		const [posts, error] = await QUERIES.fetchAllSavedPostsWithAuthorId(author_id);

		if (error) throw new Error('Error fetching posts:', error);
		if (!posts) return [];

		const result: PostProp[] = await Promise.all(
			posts.map(async (post) => {
				const { id, author_id } = post;
				let setPost: PostProp = post;

				const profile = await PROFILE_CONTROLLER.FetchProfileWithUserId(author_id);
				if (profile) setPost = { ...setPost, author: profile };

				const comments = await COMMENT_CONTROLLER.FetchAllCommentsWithPostId(id);
				if (comments) setPost = { ...setPost, comments };

				if (post.all_tags && post.all_tags.length > 0) {
					const tags: TagProp[] = (await Promise.all(
						post.all_tags.map(async (tag_id) => {
							const tag = await CONTROLLER.FetchTagWithId(tag_id);
							return tag;
						})
					)).filter((tag): tag is TagProp => tag !== undefined);

					if (tags.length > 0) setPost = { ...setPost, tags };
				}

				return setPost;
			})
		);

		return result;
	},
	/**
	 * Fetches some saved posts with the given author ID
	 * @param author_id 
	 * @param page 
	 * @param pageSize 
	 * @returns PostProp[]
	 */
	FetchSomeSavedPostsWithAuthorId: async function (
		author_id: number,
		page: number,
		pageSize: number
	): Promise<PostProp[]> {
		const [posts, error] = await QUERIES.fetchSomeSavedPostsWithAuthorId(author_id, page, pageSize);

		if (error) throw new Error('Error fetching posts:', error);
		if (!posts) return [];

		const result: PostProp[] = await Promise.all(
			posts.map(async (post) => {
				const { id, author_id } = post;
				let setPost: PostProp = post;

				const profile = await PROFILE_CONTROLLER.FetchProfileWithUserId(author_id);
				if (profile) setPost = { ...setPost, author: profile };

				const comments = await COMMENT_CONTROLLER.FetchAllCommentsWithPostId(id);
				if (comments) setPost = { ...setPost, comments };

				if (post.all_tags && post.all_tags.length > 0) {
					const tags: TagProp[] = (await Promise.all(
						post.all_tags.map(async (tag_id) => {
							const tag = await CONTROLLER.FetchTagWithId(tag_id);
							return tag;
						})
					)).filter((tag): tag is TagProp => tag !== undefined);

					if (tags.length > 0) setPost = { ...setPost, tags };
				}

				return setPost;
			})
		);

		return result;
	},
	/**
	 * Fetches all tags
	 * @returns TagProp[]
	 */
	FetchTags: async function (): Promise<TagProp[]> {
		const [tags, error] = await QUERIES.fetchTags();

		if (error) throw new Error('Error fetching tags:', error);
		if (!tags) return [];

		const result = await Promise.all(
			tags.map(async (tag) => {
				const { category_id } = tag;
				let setCategory: TagProp = tag;

				const category = await CONTROLLER.FetchCategoryWithId(category_id);
				if (category) setCategory = { ...setCategory, category: category };

				return setCategory;
			})
		);

		return result;
	},
	/**
	 * Fetches a tag with the given ID
	 * @param id 
	 * @returns TagProp | null
	 */
	FetchTagWithId: async function (id: number): Promise<TagProp | null> {
		const [tag, error] = await QUERIES.fetchTagWithId(id);

		if (error) throw new Error('Error fetching tag:', error);
		if (!tag) return null;

		let setTag: TagProp = tag;

		if (tag.category_id) {
			const category = await CONTROLLER.FetchCategoryWithId(tag.category_id);
			if (category) setTag = { ...setTag, category };
		}

		return setTag;
	},
	/**
	 * Fetches trending tags
	 * @returns TagProp[]
	 */
	FetchTrendingTags: async function (): Promise<TagProp[]> {
		const [tags, error] = await QUERIES.fetchTrendingTags();

		if (error) throw new Error('Error fetching tags:', error);
		if (!tags) return [];

		const result = await Promise.all(
			tags.map(async (tag) => {
				const { category_id } = tag;
				let setCategory: TagProp = tag;

				const category = await CONTROLLER.FetchCategoryWithId(category_id);
				if (category) setCategory = { ...setCategory, category: category };

				return setCategory;
			})
		);

		return result;
	},
	/**
	 * Fetches a category with the given ID
	 * @param id 
	 * @returns CategoryProp | null
	 */
	FetchCategoryWithId: async function (id: number): Promise<CategoryProp | null> {
		const [category, error] = await QUERIES.fetchCategoryWithId(id);

		if (error) throw new Error('Error fetching category:', error);
		if (!category) return null;

		return category;
	},
	/**
	 * Fetches trending categories
	 * @returns CategoryProp[]
	 */
	FetchTrendingCategories: async function (): Promise<CategoryProp[]> {
		const [categories, error] = await QUERIES.fetchTrendingCategories();

		if (error) throw new Error('Error fetching categories:', error);
		if (!categories) return [];

		return categories;
	},
	/**
	 * Edits a post with the given ID
	 * @param id 
	 * @param updates 
	 * @returns boolean
	 */
	EditPostWithId: async function (
		id: number,
		updates: Object
	): Promise<boolean> {
		if (!id) throw new Error("No Unique Identifier Found");

		if (!updates) throw new Error("Updates are Needed");

		const [post, error] = await MUTATIONS.updatePostWithId(id, updates);

		if (error) throw new Error('Error editing post:', error);
		if (!post) return false;

		return true;
	},
	/**
	 * Deletes a post with the given ID
	 * @param id 
	 * @returns boolean
	 */
	DeletePostWithId: async function (id: number): Promise<boolean> {
		if (!id) throw new Error("No Unique Identifier Found");

		const [post, error] = await MUTATIONS.deletePostWithId(id);

		if (error) throw new Error('Error deleting post:', error);
		if (!post) return false;

		return true;
	},
};

/**
 * Queries
 */

export const QUERIES = {
	fetchAllPosts: async function (): Promise<Result<PostProp[]>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/post/fetch-all`, {
					method: "GET",
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Fetch Posts
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let result: PostProp[] = [];

				if (data.status === true && data.data) result = data.data;

				return result;
			})()
		);
	},
	fetchSomePosts: async function (
		page: number,
		pageSize: number,
	): Promise<Result<PostProp[]>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/post/fetch-some`, {
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

				// Failed to Fetch Posts
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let result: PostProp[] = [];

				if (data.status === true && data.data) result = data.data;

				return result;
			})()
		);
	},
	fetchAllPostsWithAuthorId: async function (author_id: number): Promise<Result<PostProp[]>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/post/fetch-all-with-author-id/${author_id}`, {
					method: "GET",
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Fetch Posts
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let result: PostProp[] = [];

				if (data.status === true && data.data) result = data.data;

				return result;
			})()
		);
	},
	fetchSomePostsWithAuthorId: async function (
		author_id: number,
		page: number,
		pageSize: number,
	): Promise<Result<PostProp[]>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/post/fetch-some-with-author-id/${author_id}`, {
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

				// Failed to Fetch Posts
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let result: PostProp[] = [];

				if (data.status === true && data.data) result = data.data;

				return result;
			})()
		);
	},
	fetchAllMediaPostsWithAuthorId: async function (author_id: number): Promise<Result<PostProp[]>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/post/fetch-all-media-posts-author-id/${author_id}`, {
					method: "GET",
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Fetch Posts
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let result: PostProp[] = [];

				if (data.status === true && data.data) result = data.data;

				return result;
			})()
		);
	},
	fetchSomeMediaPostsWithAuthorId: async function (
		author_id: number,
		page: number,
		pageSize: number,
	): Promise<Result<PostProp[]>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/post/fetch-some-media-posts-author-id/${author_id}`, {
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

				// Failed to Fetch Posts
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let result: PostProp[] = [];

				if (data.status === true && data.data) result = data.data;

				return result;
			})()
		);
	},
	fetchAllSavedPostsWithAuthorId: async function (author_id: number): Promise<Result<PostProp[]>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/post/fetch-all-saved-posts-author-id/${author_id}`, {
					method: "GET",
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Fetch Posts
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let result: PostProp[] = [];

				if (data.status === true && data.data) result = data.data;

				return result;
			})()
		);
	},
	fetchSomeSavedPostsWithAuthorId: async function (
		author_id: number,
		page: number,
		pageSize: number,
	): Promise<Result<PostProp[]>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/post/fetch-some-saved-posts-author-id/${author_id}`, {
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

				// Failed to Fetch Posts
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let result: PostProp[] = [];

				if (data.status === true && data.data) result = data.data;

				return result;
			})()
		);
	},
	fetchTags: async function (): Promise<Result<TagProp[]>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/post/fetch-tags`, {
					method: "GET",
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Fetch Tags
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let result: TagProp[] = [];

				if (data.status === true && data.data) result = data.data;

				return result;
			})()
		);
	},
	fetchTagWithId: async function (id: number): Promise<Result<TagProp | null>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/post/fetch-tag-with-id/${id}`, {
					method: "GET",
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Fetch Tag
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let result: TagProp | null = null;

				if (data.status === true && data.data) result = data.data.length > 0 ? data.data[0] : null;

				return result;
			})()
		);
	},
	fetchTrendingTags: async function (): Promise<Result<TagProp[]>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/post/fetch-trending-tags`, {
					method: "GET",
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Fetch Tags
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let result: TagProp[] = [];

				if (data.status === true && data.data) result = data.data;

				return result;
			})()
		);
	},
	fetchCategoryWithId: async function (id: number): Promise<Result<CategoryProp | null>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/post/fetch-category-with-id/${id}`, {
					method: "GET",
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Fetch Category
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let result: CategoryProp | null = null;

				if (data.status === true && data.data) result = data.data.length > 0 ? data.data[0] : null;

				return result;
			})()
		);
	},
	fetchTrendingCategories: async function (): Promise<Result<CategoryProp[]>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/post/fetch-trending-categories`, {
					method: "GET",
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Fetch Tags
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let result: CategoryProp[] = [];

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
	createPost: async (
		author_id: number,
		content: string,
		args: Object,
	): Promise<Result<boolean>> => {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/post/create`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						author_id,
						content,
						args,
					}),
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Create Post
				if (data.status === false) return false;

				return true;
			})()
		);
	},
	updatePostWithId: async (
		id: number,
		updates: Object,
	): Promise<Result<boolean>> => {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/post/update/${id}`, {
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

				// Failed to Update Post
				if (data.status === false) return false;

				return true;
			})()
		);
	},
	deletePostWithId: async (id: number): Promise<Result<boolean>> => {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/post/delete/${id}`, {
					method: "DELETE",
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Delete Post
				if (data.status === false) return false;

				return true;
			})()
		);
	},
};