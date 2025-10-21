import type { ConversationProp, MessageProp, ParticipantProp } from "@/features/dashboard/types/message_types";
import { mockProfiles } from "@/features/personalization/services/profile-services";

export const QUERIES = {
	fetchConversationsByProfileId: async function (profile_id: number): Promise<ConversationProp[]> {
		await new Promise((resolve) => setTimeout(resolve, 1000));

		let conversations: ConversationProp[] = [];

		const participants = await this.fetchParticipantsByProfileId(profile_id);
		if (!participants || participants.length === 0) return [];

		const ids: number[] = participants.map(p => p.conversation_id);

		conversations = await Promise.all(
			ids.map(id => this.fetchConversationById(id))
		);

		return conversations;
	},
	fetchConversationById: async function (id: number): Promise<ConversationProp> {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		let conversation: ConversationProp | null = {} as ConversationProp;

		const data = mockConversations.find(conversation => conversation.id === id) as ConversationProp;
		if (data) conversation = data;

		const participants = await this.fetchParticipantsByConversationId(id);
		if (participants) conversation = { ...conversation, participants };

		const messages = await this.fetchMessagesByConversationId(id);
		if (messages) conversation = { ...conversation, messages };

		return conversation;
	},
	fetchParticipantsByConversationId: async function (conversation_id: number): Promise<ParticipantProp[]> {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		let participants: ParticipantProp[] = [];

		participants = mockParticipants.filter(participant => participant.conversation_id === conversation_id);

		return participants;
	},
	fetchParticipantsByProfileId: async function (profile_id: number): Promise<ParticipantProp[]> {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		let participants: ParticipantProp[] = [];

		participants = mockParticipants.filter(participant => participant.profile_id === profile_id);

		return participants;
	},
	fetchMessagesByConversationId: async function (conversation_id: number): Promise<MessageProp[]> {
		await new Promise((resolve) => setTimeout(resolve, 1000));
		let messages: MessageProp[] = [];

		messages = mockMessages.filter(message => message.conversation_id === conversation_id);

		return messages;
	},
};
export const MUTATIONS = {};

const mockConversations: Partial<ConversationProp>[] = [
	{
		id: 1,
		created_at: "2025-10-21 16:36:36.644153+00",
		updated_at: "2025-10-21 16:36:36.644153+00",
	},
	{
		id: 2,
		created_at: "2025-10-21 16:36:36.644153+00",
		updated_at: "2025-10-21 16:36:36.644153+00",
	},
	{
		id: 3,
		created_at: "2025-10-21 16:36:36.644153+00",
		updated_at: "2025-10-21 16:36:36.644153+00",
	},
];

const mockParticipants: ParticipantProp[] = [
	{
		id: 1,
		profile_id: 1,
		conversation_id: 1,
		added_at: "2025-10-21 16:36:36.644153+00",
		profile: mockProfiles[0],
	},
	{
		id: 2,
		profile_id: 2,
		conversation_id: 1,
		added_at: "2025-10-21 16:36:36.644153+00",
		profile: mockProfiles[1],
	},
	{
		id: 3,
		profile_id: 3,
		conversation_id: 2,
		added_at: "2025-10-21 16:36:36.644153+00",
		profile: mockProfiles[2],
	},
	{
		id: 4,
		profile_id: 4,
		conversation_id: 2,
		added_at: "2025-10-21 16:36:36.644153+00",
		profile: mockProfiles[3],
	},
	{
		id: 5,
		profile_id: 1,
		conversation_id: 3,
		added_at: "2025-10-21 16:36:36.644153+00",
		profile: mockProfiles[0],
	},
	{
		id: 6,
		profile_id: 3,
		conversation_id: 3,
		added_at: "2025-10-21 16:36:36.644153+00",
		profile: mockProfiles[2],
	},
];

const mockMessages: MessageProp[] = [
	{
		id: 1,
		conversation_id: 1,
		sender_id: 1,
		receiver_id: 2,
		sent_at: "2025-10-21 16:36:36.644153+00",
		updated_at: "2025-10-21 16:36:36.644153+00",
		content: "Hello",
		images: null,
		is_read: false,
		sender: mockProfiles[0],
	},
	{
		id: 2,
		conversation_id: 1,
		sender_id: 2,
		receiver_id: 1,
		sent_at: "2025-10-21 16:39:36.644153+00",
		updated_at: "2025-10-21 16:39:36.644153+00",
		content: "Hi",
		images: null,
		is_read: false,
		sender: mockProfiles[1],
	},
	{
		id: 3,
		conversation_id: 2,
		sender_id: 3,
		receiver_id: 4,
		sent_at: "2025-10-21 16:41:36.644153+00",
		updated_at: "2025-10-21 16:41:36.644153+00",
		content: "Hello",
		images: null,
		is_read: false,
		sender: mockProfiles[2],
	},
	{
		id: 4,
		conversation_id: 2,
		sender_id: 4,
		receiver_id: 3,
		sent_at: "2025-10-21 16:42:36.644153+00",
		updated_at: "2025-10-21 16:42:36.644153+00",
		content: "Hi",
		images: null,
		is_read: false,
		sender: mockProfiles[3],
	},
	{
		id: 5,
		conversation_id: 3,
		sender_id: 1,
		receiver_id: 3,
		sent_at: "2025-10-21 16:42:36.644153+00",
		updated_at: "2025-10-21 16:42:36.644153+00",
		content: "Hi",
		images: null,
		is_read: false,
		sender: mockProfiles[0],
	},
];