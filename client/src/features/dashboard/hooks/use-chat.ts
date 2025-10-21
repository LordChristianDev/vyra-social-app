import type { ConversationProp } from "../types/message_types";

export const useChat = () => {
	const filterConversations = (
		profileId: number,
		convos: ConversationProp[],
		query: string
	): ConversationProp[] => {
		if (convos.length === 0) return [];
		if (!query.trim()) return convos;

		const lowerQuery = query.toLowerCase();

		return convos.filter((convo) => {
			const { participants } = convo;
			const { profile } = participants.find((p) => Number(p.profile.id) !== profileId)!;
			const { first_name, last_name } = profile;

			const fn = first_name.toLowerCase();
			const ln = last_name.toLowerCase();

			return (fn.includes(lowerQuery) || ln.includes(lowerQuery));
		});
	}

	return { filterConversations };
};