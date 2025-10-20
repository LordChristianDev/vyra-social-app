import type { ProfileProp } from "@/features/personalization/types/profile-types";

export const QUERIES = {
	fetchProfileWithId: async function (id: number): Promise<ProfileProp | null> {
		await new Promise((resolve) => setTimeout(resolve, 1000))

		const profile: ProfileProp | null = mockProfiles.find(profile => profile.id === id) ?? null;
		return profile;
	},
	fetchProfileWithUserId: async function (user_id: number): Promise<ProfileProp | null> {
		await new Promise((resolve) => setTimeout(resolve, 1000))

		const profile: ProfileProp | null = mockProfiles.find(profile => profile.user_id === user_id) ?? null;
		return profile;
	},
};

const mockProfiles: ProfileProp[] = [
	{
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
	},
	{
		id: 2,
		user_id: 2,
		created_at: "2025-09-25 11:32:11.644153+00",
		updated_at: "2025-09-25 11:32:11.644153+00",

		first_name: "Base",
		middle_name: null,
		suffix: null,
		last_name: "UI",
		birth_date: "1998-05-11",
		avatar_url: "https://github.com/shadcn.png",
		cover_url: "https://ilbnjaefxdwtqdjtnzgy.supabase.co/storage/v1/object/public/covers/1_1758526509534.jpg",

		username: "baseui",
		bio: "UI Components Creator | Javascript Frameworks Enthusiasts",
		location: "Los Angeles, USA",
		website_url: "https://lord-christian-portfolio.vercel.app/",
		description: "I am new to this platform, please teach me how this works.",

		all_following: [0, 1, 2, 3, 4, 7, 8, 9],
		all_followers: [3, 4, 6, 1, 2, 1, 23, 5, 934, 4294],

		notif_settings: {
			id: 2,
			user_id: 2,

			notify_likes: false,
			notify_comments: false,
			notify_follows: false,
			notify_messages: false,
		},
		privacy_settings: {
			id: 2,
			user_id: 2,

			is_verified: false,
			is_public: false,
			show_active: false,
		}
	},
];
