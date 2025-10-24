import type { ProfileProp } from "@/features/personalization/types/profile-types";

export type NotificationProp = {
	id: number;
	author_id: number;
	recipient_id: number;
	created_at: string;

	content: string;
	type: "like" | "comment" | "follow" | "share" | "message";
	is_read: boolean;

	author: ProfileProp;
};

