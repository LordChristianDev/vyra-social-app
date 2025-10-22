import type { ProfileProp } from "@/features/personalization/types/profile-types";


export type NotificationProp = {
	id: number;
	author_id: number;
	created_at: string;

	type: "like" | "comment" | "follow" | "share" | "message";
	content: string;
	is_read: boolean;

	author: ProfileProp;
};

