import { eq, desc, and, not, notInArray, inArray } from "drizzle-orm";

import { db } from "@config/db";
import { queryDB } from "@/utils/try-catch";

import {
	SelectConversation,
	conversationsTable as CONVERSATIONS_TABLE,
	InsertParticipant,
	SelectParticipant,
	participantsTable as PARTICIPANTS_TABLE,
	InsertMessage,
	SelectMessage,
	messagesTable as MESSAGES_TABLE,
	profilesTable as PROFILES_TABLE,
} from "@/db/schema";

export const QUERIES = {
	fetchAllConversationsByProfileId: async function (
		profile_id: SelectParticipant["profile_id"]
	) {
		return queryDB(async () => {
			const result = await db
				.select({
					id: CONVERSATIONS_TABLE.id,
					created_at: CONVERSATIONS_TABLE.created_at,
					updated_at: CONVERSATIONS_TABLE.updated_at,
				})
				.from(CONVERSATIONS_TABLE)
				.innerJoin(
					PARTICIPANTS_TABLE,
					eq(PARTICIPANTS_TABLE.conversation_id, CONVERSATIONS_TABLE.id)
				)
				.where(eq(PARTICIPANTS_TABLE.profile_id, profile_id));

			return result;
		});
	},
	fetchSomeConversationsByProfileId: async function (
		profile_id: SelectParticipant["profile_id"],
		page: number,
		pageSize: number,
	) {
		return queryDB(async () => {
			const result = await db
				.select({
					id: CONVERSATIONS_TABLE.id,
					created_at: CONVERSATIONS_TABLE.created_at,
					updated_at: CONVERSATIONS_TABLE.updated_at,
				})
				.from(CONVERSATIONS_TABLE)
				.innerJoin(
					PARTICIPANTS_TABLE,
					eq(PARTICIPANTS_TABLE.conversation_id, CONVERSATIONS_TABLE.id)
				)
				.where(eq(PARTICIPANTS_TABLE.profile_id, profile_id))
				.limit(pageSize)
				.offset((page - 1) * pageSize);

			return result;
		});
	},
	fetchConversationById: async function (id: SelectConversation["id"]) {
		return queryDB(async () => {
			const result = await db
				.select()
				.from(CONVERSATIONS_TABLE)
				.where(eq(CONVERSATIONS_TABLE.id, id));

			return result;
		});
	},
	fetchMostRecentConversation: async function () {
		return queryDB(async () => {
			const result = await db
				.select()
				.from(CONVERSATIONS_TABLE)
				.orderBy(desc(CONVERSATIONS_TABLE.created_at))
				.limit(1);

			return result;
		});
	},
	fetchConversationBetweenProfiles: async function (
		profile_id: SelectParticipant["profile_id"],
		user_id: SelectParticipant["profile_id"]
	) {
		return queryDB(async () => {
			const result = await db
				.select({
					id: CONVERSATIONS_TABLE.id,
					created_at: CONVERSATIONS_TABLE.created_at,
					updated_at: CONVERSATIONS_TABLE.updated_at,
				})
				.from(CONVERSATIONS_TABLE)
				.where(
					and(
						inArray(
							CONVERSATIONS_TABLE.id,
							db
								.select({ conversation_id: PARTICIPANTS_TABLE.conversation_id })
								.from(PARTICIPANTS_TABLE)
								.where(eq(PARTICIPANTS_TABLE.profile_id, profile_id))
						),
						inArray(
							CONVERSATIONS_TABLE.id,
							db
								.select({ conversation_id: PARTICIPANTS_TABLE.conversation_id })
								.from(PARTICIPANTS_TABLE)
								.where(eq(PARTICIPANTS_TABLE.profile_id, user_id))
						)
					)
				)
				.limit(1);

			return result;
		});
	},
	fetchParticipantsByConversationId: async function (
		conversation_id: SelectParticipant["conversation_id"]
	) {
		return queryDB(async () => {
			const result = await db
				.select()
				.from(PARTICIPANTS_TABLE)
				.where(eq(PARTICIPANTS_TABLE.conversation_id, conversation_id));

			return result;
		});
	},
	fetchParticipantsByProfileId: async function (
		profile_id: SelectParticipant["profile_id"]
	) {
		return queryDB(async () => {
			const result = await db
				.select()
				.from(PARTICIPANTS_TABLE)
				.where(eq(PARTICIPANTS_TABLE.profile_id, profile_id));

			return result;
		});
	},
	fetchMessagesByConversationId: async function (
		conversation_id: SelectMessage["conversation_id"]
	) {
		return queryDB(async () => {
			const result = await db
				.select()
				.from(MESSAGES_TABLE)
				.where(eq(MESSAGES_TABLE.conversation_id, conversation_id))
				.orderBy(desc(MESSAGES_TABLE.sent_at));

			return result;
		});
	},
	fetchProfilesWithoutConversationWithUserId: async function (
		user_id: SelectParticipant["profile_id"]
	) {
		return queryDB(async () => {
			const result = await db
				.select()
				.from(PROFILES_TABLE)
				.where(
					and(
						not(eq(PROFILES_TABLE.user_id, user_id)),
						notInArray(
							PROFILES_TABLE.user_id,
							db
								.selectDistinct({ profile_id: PARTICIPANTS_TABLE.profile_id })
								.from(PARTICIPANTS_TABLE)
								.where(
									inArray(
										PARTICIPANTS_TABLE.conversation_id,
										db
											.select({ conversation_id: PARTICIPANTS_TABLE.conversation_id })
											.from(PARTICIPANTS_TABLE)
											.where(eq(PARTICIPANTS_TABLE.profile_id, user_id))
									)
								)
						)
					)
				);

			return result;
		});
	},
};

export const MUTATIONS = {
	createConversation: async function () {
		return queryDB(async () => {
			const result = await db.insert(CONVERSATIONS_TABLE).values({});

			return result;
		});
	},
	createParticipant: async function (
		profile_id: InsertParticipant["profile_id"],
		conversation_id: InsertParticipant["conversation_id"],
	) {
		return queryDB(async () => {
			const data: InsertParticipant = {
				profile_id,
				conversation_id,
			};

			const result = await db.insert(PARTICIPANTS_TABLE).values(data);

			return result;
		});
	},
	createMessage: async function (
		conversation_id: InsertMessage["conversation_id"],
		sender_id: InsertMessage["sender_id"],
		receiver_id: InsertMessage["receiver_id"],
		content: InsertMessage["content"],
	) {
		return queryDB(async () => {
			const data: InsertMessage = {
				conversation_id,
				sender_id,
				receiver_id,
				content,
			};

			const result = await db.insert(MESSAGES_TABLE).values(data);

			return result;
		});
	},
	deleteConversationsWithId: async function (id: SelectConversation["id"]) {
		return queryDB(async () => {
			const result = await db
				.delete(CONVERSATIONS_TABLE)
				.where(eq(CONVERSATIONS_TABLE.id, id));

			return result;
		});
	},
	deleteParticipantsWithId: async function (id: SelectParticipant["id"]) {
		return queryDB(async () => {
			const result = await db
				.delete(PARTICIPANTS_TABLE)
				.where(eq(PARTICIPANTS_TABLE.id, id));

			return result;
		});
	},
	deleteMessagesWithId: async function (id: SelectMessage["id"]) {
		return queryDB(async () => {
			const result = await db
				.delete(MESSAGES_TABLE)
				.where(eq(MESSAGES_TABLE.id, id));

			return result;
		});
	},
};