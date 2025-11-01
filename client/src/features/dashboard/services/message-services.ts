import { BASE_URL } from "@/main";
import { tryCatch, type Result } from "@/lib/try-catch";

import type {
	ConversationProp,
	MessageProp,
	ParticipantProp
} from "@/features/dashboard/types/message_types";

import type { ProfileProp } from "@/features/personalization/types/profile-types";
import {
	CONTROLLER as PROFILE_CONTROLLER
} from "@/features/personalization/services/profile-services";

/**
 * Controller
 */

export const CONTROLLER = {
	/**
	 * Create New Conversation
	 * @param profile_id 
	 * @param user_id 
	 * @returns boolean
	 */
	CreateNewConversation: async function (profile_id: number, user_id: number): Promise<boolean> {
		if (!profile_id) throw new Error("No Unique Identifier Found");

		const [create, createError] = await MUTATIONS.createConversation();

		if (createError) throw new Error("Failed to create conversation");
		if (!create) return false;

		const [newConvo, newConvoError] = await QUERIES.fetchMostRecentConversation();

		if (newConvoError) throw new Error("Failed to fetch most recent conversation");
		if (!newConvo) return false;

		await CONTROLLER.AddNewParticipant(user_id, newConvo.id);
		await CONTROLLER.AddNewParticipant(profile_id, newConvo.id);

		return true;
	},
	/**
	 * Add New Participant
	 * @param profile_id 
	 * @param conversation_id 
	 * @returns boolean
	 */
	AddNewParticipant: async function (profile_id: number, conversation_id: number): Promise<boolean> {
		if (!profile_id) throw new Error("No Unique Identifier Found");
		if (!conversation_id) throw new Error("No Unique Identifier Found");

		const [create, createError] = await MUTATIONS.createParticipant(
			profile_id,
			conversation_id
		);

		if (createError) throw new Error("Failed to create participant");
		if (!create) return false;

		return true;
	},
	/**
	 * Send Message
	 * @param conversation_id 
	 * @param sender_id 
	 * @param receiver_id 
	 * @param message 
	 * @returns boolean
	 */
	SendMessage: async function (
		conversation_id: number,
		sender_id: number,
		receiver_id: number,
		message: string,
	): Promise<boolean> {
		if (!conversation_id) throw new Error("No Unique Identifier Found");
		if (!message) throw new Error("No Message Found");

		const [create, createError] = await MUTATIONS.createMessage(
			conversation_id,
			sender_id,
			receiver_id,
			message
		);

		if (createError) throw new Error("Failed to create message");
		if (!create) return false;

		return true;
	},
	/**
	 * Fetch Conversation with Profile ID
	 * @param profile_id 
	 * @returns boolean
	 */
	FetchAllConversationWithProfileId: async function (profile_id: number): Promise<ConversationProp[]> {
		if (!profile_id) throw new Error("No Unique Identifier Found");

		const [data, error] = await QUERIES.fetchAllConversationsWithProfileId(profile_id);

		if (error) throw new Error("Failed to fetch conversation");
		if (!data) return [];

		const result: ConversationProp[] = await Promise.all(
			data.map(async (convo) => {
				let setConvo: ConversationProp = convo;

				const participants = await CONTROLLER.FetchParticipantsWithConversationId(convo.id);
				if (participants) setConvo = { ...setConvo, participants };

				const messages = await CONTROLLER.FetchMessagesWithConversationId(convo.id);
				if (messages) setConvo = { ...setConvo, messages };

				return setConvo;
			})
		);

		return result;
	},
	/**
	 * Fetch Participants with Conversation ID
	 * @param conversation_id 
	 * @returns ParticipantProp[]
	 */
	FetchParticipantsWithConversationId: async function (conversation_id: number): Promise<ParticipantProp[]> {
		if (!conversation_id) throw new Error("No Unique Identifier Found");

		const [data, error] = await QUERIES.fetchParticipantsWithConversationId(conversation_id);

		if (error) throw new Error("Failed to fetch participant");
		if (!data) return [];

		const result: ParticipantProp[] = await Promise.all(
			data.map(async (participant) => {
				let setParticipant: ParticipantProp = participant;

				const profile = await PROFILE_CONTROLLER.FetchProfileWithUserId(participant.profile_id);
				if (profile) setParticipant = { ...setParticipant, profile };

				return setParticipant;
			})
		);

		return result;
	},
	/**
	 * Fetch Messages with Conversation ID
	 * @param conversation_id 
	 * @returns MessageProp[]
	 */
	FetchMessagesWithConversationId: async function (conversation_id: number): Promise<MessageProp[]> {
		if (!conversation_id) throw new Error("No Unique Identifier Found");

		const [data, error] = await QUERIES.fetchMessagesWithConversationId(conversation_id);

		if (error) throw new Error("Failed to fetch message");
		if (!data) return [];

		let result: MessageProp[] = await Promise.all(
			data.map(async (message) => {
				let setMessage: MessageProp = message;

				const sender = await PROFILE_CONTROLLER.FetchProfileWithUserId(message.sender_id);
				if (sender) setMessage = { ...setMessage, sender };

				return setMessage;
			})
		);

		return result;
	},
	/**
	 * Fetch Starter Conversations with User ID
	 * @param user_id 
	 * @returns ProfileProp[]
	 */
	FetchStartConvoProfiles: async function (user_id: number): Promise<ProfileProp[]> {
		if (!user_id) throw new Error("No Unique Identifier Found");

		const [data, error] = await QUERIES.fetchProfilesWithoutConversationWithUserId(user_id);

		if (error) throw new Error('Error fetching user:', error);
		if (!data) return [];

		let profiles: ProfileProp[] = [];

		if (data) profiles = data;

		return profiles;
	},
	/**
	 * Delete Conversation
	 * @param id 
	 * @returns boolean
	 */
	DeleteConversation: async function (id: number): Promise<boolean> {
		if (!id) throw new Error("No Unique Identifier Found");

		const [data, error] = await MUTATIONS.deleteConversation(id);

		if (error) throw new Error("Failed to delete conversation");
		if (!data) return false;

		return true;
	},
	/**
	 * Delete Participant
	 * @param id 
	 * @returns boolean
	 */
	DeleteParticipant: async function (id: number): Promise<boolean> {
		if (!id) throw new Error("No Unique Identifier Found");

		const [data, error] = await MUTATIONS.deleteParticipant(id);

		if (error) throw new Error("Failed to delete participant");
		if (!data) return false;

		return true;
	},
	/**
	 * Delete Message
	 * @param id 
	 * @returns boolean
	 */
	DeleteMessage: async function (id: number): Promise<boolean> {
		if (!id) throw new Error("No Unique Identifier Found");

		const [data, error] = await MUTATIONS.deleteMessage(id);

		if (error) throw new Error("Failed to delete message");
		if (!data) return false;

		return true;
	},
};

/**
 * Queries
 */

export const QUERIES = {
	fetchAllConversationsWithProfileId: async function (profile_id: number): Promise<Result<ConversationProp[]>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/message/fetch-all-converations-profile-id/${profile_id}`, {
					method: "GET",
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Fetch Conversations
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let result: ConversationProp[] = [];

				if (data.status === true && data.data) result = data.data;

				return result;
			})()
		);
	},
	fetchSomeConversationsWithProfileId: async function (
		profile_id: number,
		page: number,
		pageSize: number,
	): Promise<Result<ConversationProp[]>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/message/fetch-some-converations-profile-id/${profile_id}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						page,
						pageSize,
					})
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Fetch Conversations
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let result: ConversationProp[] = [];

				if (data.status === true && data.data) result = data.data;

				return result;
			})()
		);
	},
	fetchConversationWithId: async function (id: number): Promise<Result<ConversationProp | null>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/message/fetch-converation/${id}`, {
					method: "GET",
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Fetch Conversation
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let result: ConversationProp | null = null;

				if (data.status === true && data.data) result = data.data.length > 0 ? data.data[0] : null;

				return result;
			})()
		);
	},
	fetchMostRecentConversation: async function (): Promise<Result<ConversationProp | null>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/message/fetch-most-recent-conversation`, {
					method: "GET",
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Fetch Conversation
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let result: ConversationProp | null = null;

				if (data.status === true && data.data) result = data.data.length > 0 ? data.data[0] : null;

				return result;
			})()
		);
	},
	fetchConversationBetweenProfiles: async function (
		profile_id: number,
		user_id: number
	): Promise<Result<ConversationProp | null>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/message/fetch-converation-with-profile-and-user-id`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						profile_id,
						user_id
					}),
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Fetch Conversation
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let result: ConversationProp | null = null;

				if (data.status === true && data.data) result = data.data.length > 0 ? data.data[0] : null;

				return result;
			})()
		);
	},
	fetchParticipantsWithConversationId: async function (conversation_id: number): Promise<Result<ParticipantProp[]>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/message/fetch-participants-conversation-id/${conversation_id}`, {
					method: "GET",
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Fetch Participants
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let result: ParticipantProp[] = [];

				if (data.status === true && data.data) result = data.data;

				return result;
			})()
		);
	},
	fetchParticipantsWithProfileId: async function (profile_id: number): Promise<Result<ParticipantProp[]>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/message/fetch-participants-profile-id/${profile_id}`, {
					method: "GET",
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Fetch Participants
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let result: ParticipantProp[] = [];

				if (data.status === true && data.data) result = data.data;

				return result;
			})()
		);
	},
	fetchMessagesWithConversationId: async function (conversation_id: number): Promise<Result<MessageProp[]>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/message/fetch-messages/${conversation_id}`, {
					method: "GET",
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Fetch Messages
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let result: MessageProp[] = [];

				if (data.status === true && data.data) result = data.data;

				return result;
			})()
		);
	},
	fetchProfilesWithoutConversationWithUserId: async function (user_id: number): Promise<Result<ProfileProp[]>> {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/message/fetch-profiles-without-conversation/${user_id}`, {
					method: "GET",
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Fetch Profiles
				if (data.status === false) throw new Error(data.error || "Something went wrong!");

				let profiles: ProfileProp[] = [];

				if (data.status === true && data.data) profiles = data.data;

				return profiles;
			})()
		);
	},
};

/**
 * Mutations
 */

export const MUTATIONS = {
	createConversation: async (): Promise<Result<boolean>> => {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/message/create-conversation`, {
					method: "POST",
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Create Conversation
				if (data.status === false) return false;

				return true;
			})()
		);
	},
	createParticipant: async (
		profile_id: number,
		conversation_id: number
	): Promise<Result<boolean>> => {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/message/create-participant/${profile_id}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						conversation_id,
					}),
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Create Participant
				if (data.status === false) return false;

				return true;
			})()
		);
	},
	createMessage: async (
		conversation_id: number,
		sender_id: number,
		receiver_id: number,
		content: string,
	): Promise<Result<boolean>> => {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/message/create-message`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						conversation_id,
						sender_id,
						receiver_id,
						content,
					}),
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Create Message
				if (data.status === false) return false;

				return true;
			})()
		);
	},
	deleteConversation: async (id: number): Promise<Result<boolean>> => {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/message/delete-conversation/${id}`, {
					method: "DELETE",
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Delete Conversation
				if (data.status === false) return false;

				return true;
			})()
		);
	},
	deleteParticipant: async (id: number): Promise<Result<boolean>> => {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/message/delete-participant/${id}`, {
					method: "DELETE",
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Delete Participant
				if (data.status === false) return false;

				return true;
			})()
		);
	},
	deleteMessage: async (id: number): Promise<Result<boolean>> => {
		return tryCatch(
			(async () => {
				const response = await fetch(BASE_URL + `/message/delete-message/${id}`, {
					method: "DELETE",
				});
				const data = await response.json();

				if (!response.ok) {
					throw new Error(data.error || "Something went wrong!");
				}

				// Failed to Delete Message
				if (data.status === false) return false;

				return true;
			})()
		);
	},
};