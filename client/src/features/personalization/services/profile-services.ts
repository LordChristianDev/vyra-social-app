import type { ProfileProp } from "@/features/personalization/types/profile-types";

export const QUERIES = {
	fetchProfileWithId: async function (): Promise<ProfileProp | null> {
		await new Promise((resolve) => setTimeout(resolve, 2000))

		let profile: ProfileProp = mockProfile;
		return profile;
	},
	fetchProfileWithUserId: async function (): Promise<ProfileProp | null> {
		await new Promise((resolve) => setTimeout(resolve, 2000))

		let profile: ProfileProp = mockProfile;
		return profile;
	},
};

export const MUTATIONS = {};

const mockProfile: ProfileProp = {
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
};

