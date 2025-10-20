import type { ProfileProp } from "@/features/personalization/types/profile-types";
import type { PostProp } from "../types/dashboard-types";
import { QUERIES as PROFILE_QUERIES } from "@/features/personalization/services/profile-services";

export const QUERIES = {
	fetchPostsByAuthorId: async function (author_id: number): Promise<PostProp[]> {
		if (!author_id) throw new Error("No Unique Identifier!");

		await new Promise(resolve => setTimeout(resolve, 1000));

		// fetching Data by ID
		const data = mockPost.filter(post => post.author_id === author_id) as PostProp[];

		if (!data) return [];

		let posts: PostProp[] = await Promise.all(
			data.map(async (post) => {
				let setPost: PostProp = post;

				const author = await PROFILE_QUERIES.fetchProfileWithUserId(post.author_id);
				if (author) setPost = { ...setPost, author: author };

				return setPost;
			})
		);

		return posts;
	},
};

export const MUTATIONS = {};

const mockPost: Partial<PostProp>[] = [
	{
		id: 1,
		author_id: 1,
		created_at: "2025-09-20 16:48:11.644153+00",
		updated_at: "2025-09-20 16:48:11.644153+00",

		content: "This is my first post !",
		youtube_embed: null,
		images: null,
		tags: null,
		comments: [
			{
				id: 2,
				author_id: 2,
				created_at: "2025-09-26 18:38:11.644153+00",
				content: "Welcome !",
				all_likes: [],
				author: {
					id: 1,
					user_id: 1,
					created_at: "2025-09-20 16:48:11.644153+00",
					updated_at: "2025-09-20 16:48:11.644153+00",

					first_name: "Shad",
					middle_name: null,
					suffix: null,
					last_name: "Meister",
					birth_date: "1994-04-06",
					avatar_url: "https://github.com/shadcn.png",
					cover_url: "https://ilbnjaefxdwtqdjtnzgy.supabase.co/storage/v1/object/public/covers/1_1758526509534.jpg",

					username: "mister_olive",
					bio: "Software Engineer | React Dev | Hackathon 1st Placer",
					location: "Cebu, Philippines",
					website_url: "https://lord-christian-portfolio.vercel.app/",
					description: "I am new to this platform, please teach me how this works.",

					all_following: [0, 1, 2, 3, 4, 5],
					all_followers: [3, 4, 6, 1, 2, 1, 23, 6, 2],

					notif_settings: {
						id: 1,
						user_id: 1,

						notify_likes: false,
						notify_comments: false,
						notify_follows: false,
						notify_messages: false,
					},
					privacy_settings: {
						id: 1,
						user_id: 1,

						is_verified: false,
						is_public: false,
						show_active: false,
					}
				}
			}
		],

		all_likes: [1],
		all_saved: [],
		all_shares: [],
	},
	{
		id: 2,
		author_id: 1,
		created_at: "2025-09-21 17:48:11.644153+00",
		updated_at: "2025-09-21 17:48:11.644153+00",

		content: "This site is amazing !",
		youtube_embed: "nlnH-_Etzbo?si=TAUKFHkZN5iFdPJ1",
		images: null,
		tags: null,
		comments: null,

		all_likes: [2],
		all_saved: [],
		all_shares: [],
	},
	{
		id: 3,
		author_id: 2,
		created_at: "2025-09-23 18:08:11.644153+00",
		updated_at: "2025-09-23 18:08:11.644153+00",

		content: "Cool Images that I love !",
		youtube_embed: "g9_wkyAfi3c?si=pjW2Pfes5spoP3PC",
		images: [
			"https://qoxcrtuminwsohrwrzda.supabase.co/storage/v1/object/public/avatars/86_1757155168601.png",
			"https://qoxcrtuminwsohrwrzda.supabase.co/storage/v1/object/public/avatars/86_1757155225225.png",
		],
		tags: [
			{
				id: 1,
				created_at: "2025-09-23 18:08:11.644153+00",
				title: "UI Design"
			},
		],
		comments: [
			{
				id: 1,
				author_id: 1,
				created_at: "2025-09-23 19:28:11.644153+00",
				content: "This looks cool !",
				all_likes: [],
				author: {
					id: 1,
					user_id: 1,
					created_at: "2025-09-20 16:48:11.644153+00",
					updated_at: "2025-09-20 16:48:11.644153+00",

					first_name: "Shad",
					middle_name: null,
					suffix: null,
					last_name: "Meister",
					birth_date: "1994-04-06",
					avatar_url: "https://github.com/shadcn.png",
					cover_url: "https://ilbnjaefxdwtqdjtnzgy.supabase.co/storage/v1/object/public/covers/1_1758526509534.jpg",

					username: "mister_olive",
					bio: "Software Engineer | React Dev | Hackathon 1st Placer",
					location: "Cebu, Philippines",
					website_url: "https://lord-christian-portfolio.vercel.app/",
					description: "I am new to this platform, please teach me how this works.",

					all_following: [0, 1, 2, 3, 4, 5],
					all_followers: [3, 4, 6, 1, 2, 1, 23, 6, 2],

					notif_settings: {
						id: 1,
						user_id: 1,

						notify_likes: false,
						notify_comments: false,
						notify_follows: false,
						notify_messages: false,
					},
					privacy_settings: {
						id: 1,
						user_id: 1,

						is_verified: false,
						is_public: false,
						show_active: false,
					}
				} as ProfileProp,
			},
		],

		all_likes: [1, 2, 4],
		all_saved: [],
		all_shares: [],
	},
];