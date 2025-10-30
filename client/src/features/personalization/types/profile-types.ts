import type {
	NotificationSettingsProp,
	PrivacySettingsProp,
} from "@/features/personalization/types/settings-types";

export type ProfileProp = {
	id: number;
	user_id: number;
	created_at: string;
	updated_at: string | null;

	first_name: string;
	middle_name: string | null;
	suffix: string | null;
	last_name: string;
	birth_date: string | null;
	avatar_url: string | null;
	cover_url: string | null;

	username: string;
	bio: string | null;
	location: string | null;
	website_url: string | null;
	description: string | null;

	all_following: number[];
	all_followers: number[];

	notif_settings: NotificationSettingsProp;
	privacy_settings: PrivacySettingsProp;
};

export type MediaProp = {
	id?: string;
	file: File;
	url?: string;
	type: string;
};