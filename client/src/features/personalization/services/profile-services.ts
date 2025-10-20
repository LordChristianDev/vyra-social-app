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
	fetchProfileWithUsername: async function (username: string): Promise<ProfileProp | null> {
		await new Promise((resolve) => setTimeout(resolve, 1000))

		const profile: ProfileProp | null = mockProfiles.find(profile => profile.username === username) ?? null;
		return profile;
	},
	fetchSuggestedProfiles: async function (user_id: number): Promise<ProfileProp[]> {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		let profiles: ProfileProp[] = [];

		profiles = mockProfiles.filter(profile => profile.user_id !== user_id && !profile.all_followers.includes(user_id));
		return profiles;
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

			notify_likes: true,
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
	{
		id: 3,
		user_id: 3,
		created_at: "2025-09-25 11:32:11.644153+00",
		updated_at: "2025-09-25 11:32:11.644153+00",

		first_name: "Mike",
		middle_name: null,
		suffix: null,
		last_name: "Johnson",
		birth_date: "1997-08-22",
		avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
		cover_url: "https://ilbnjaefxdwtqdjtnzgy.supabase.co/storage/v1/object/public/covers/1_1758526509534.jpg",

		username: "tech_guru",
		bio: "Frontend Developer & UI/UX enthusiast",
		location: "New York, USA",
		website_url: "https://lord-christian-portfolio.vercel.app/",
		description: "I love learning about tech, let's learn about tech together.",

		all_following: [0, 2, 3, 4, 7, 8, 9, 11, 12, 14, 16, 18],
		all_followers: [3, 4, 6, 2, 23, 5, 934, 4294],

		notif_settings: {
			id: 3,
			user_id: 3,

			notify_likes: false,
			notify_comments: false,
			notify_follows: false,
			notify_messages: false,
		},
		privacy_settings: {
			id: 3,
			user_id: 3,

			is_verified: false,
			is_public: false,
			show_active: false,
		}
	},
	{
		id: 4,
		user_id: 4,
		created_at: "2025-09-25 11:32:11.644153+00",
		updated_at: "2025-09-25 11:32:11.644153+00",

		first_name: "Emma",
		middle_name: null,
		suffix: null,
		last_name: "Wilson",
		birth_date: "1992-07-31",
		avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
		cover_url: "https://ilbnjaefxdwtqdjtnzgy.supabase.co/storage/v1/object/public/covers/1_1758526509534.jpg",

		username: "design_maven",
		bio: "Creative Director at Design Studio",
		location: "Washington, USA",
		website_url: "https://lord-christian-portfolio.vercel.app/",
		description: "I'm a design enthusiast, if you have a cool design please let me look at it",

		all_following: [0, 2, 3, 4, 7, 8, 9, 11, 12, 14, 16, 18, 19, 21, 23, 24, 25, 26, 27],
		all_followers: [3, 4, 6, 2, 23, 5, 934, 4294, 10023, 12, 13, 24],

		notif_settings: {
			id: 4,
			user_id: 4,

			notify_likes: false,
			notify_comments: false,
			notify_follows: false,
			notify_messages: false,
		},
		privacy_settings: {
			id: 4,
			user_id: 4,

			is_verified: false,
			is_public: false,
			show_active: false,
		}
	},
	{
		id: 5,
		user_id: 5,
		created_at: "2025-09-25 11:32:11.644153+00",
		updated_at: "2025-09-25 11:32:11.644153+00",

		first_name: "David",
		middle_name: null,
		suffix: null,
		last_name: "Lee",
		birth_date: "1992-07-31",
		avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
		cover_url: "https://ilbnjaefxdwtqdjtnzgy.supabase.co/storage/v1/object/public/covers/1_1758526509534.jpg",

		username: "startup_founder",
		bio: "Building the future of tech",
		location: "Portland, USA",
		website_url: "https://lord-christian-portfolio.vercel.app/",
		description: "Creative startup founder, visionary to the future of tech",

		all_following: [0, 2, 3, 4, 7, 8, 9, 11, 12, 14, 16, 18, 19, 21, 23, 24, 25, 26, 27],
		all_followers: [3, 4, 6, 2, 23, 5, 934, 4294, 10023, 12, 13, 24],

		notif_settings: {
			id: 5,
			user_id: 5,

			notify_likes: false,
			notify_comments: false,
			notify_follows: false,
			notify_messages: false,
		},
		privacy_settings: {
			id: 5,
			user_id: 5,

			is_verified: false,
			is_public: false,
			show_active: false,
		}
	},
];
