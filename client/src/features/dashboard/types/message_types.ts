import type { ProfileProp } from "@/features/personalization/types/profile-types";

export type ConversationProp = {
	id: number;
	created_at: string;
	updated_at: string | null;

	participants: ParticipantProp[];
	messages: MessageProp[];
};

export type ParticipantProp = {
	id: number;
	profile_id: number;
	conversation_id: number;
	added_at: string;

	profile: ProfileProp;
};

export type MessageProp = {
	id: number;
	conversation_id: number
	sender_id: number;
	receiver_id: number;
	sent_at: string;
	updated_at: string | null;

	content: string;
	images: string[] | null;
	is_read: boolean;

	sender: ProfileProp;
};