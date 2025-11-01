import { Context } from 'koa';
import Router from '@koa/router';

import {
	SelectConversation,
	InsertParticipant,
	SelectParticipant,
	InsertMessage,
	SelectMessage,
} from "@/db/schema";

import {
	QUERIES,
	MUTATIONS,
} from '@/modules/messages/server/message-server';

import { QUERIES as PROFILE_QUERIES } from '@/modules/profiles/server/profile-server';

import { wsServer } from '../server/websocket-server';

const router = new Router();

// Route Check
router.get('/', (ctx) => {
	ctx.body = { message: 'Message Route is Working!' };
});

/**
 * Create
 */

router.post('/create-conversation', async (ctx) => {
	const [data, error] = await MUTATIONS.createConversation();

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: "Failed to create conversation",
			message: error.message,
		};
		return;
	}

	ctx.status = 200;
	ctx.body = {
		status: true,
		data,
	};
});

router.post('/create-participant/:profile_id', async (ctx) => {
	const profile_id: InsertParticipant["profile_id"] = Number(ctx.params.profile_id);
	const request_body = ctx.request.body as { conversation_id: InsertParticipant["conversation_id"] };
	const { conversation_id } = request_body;

	const [data, error] = await MUTATIONS.createParticipant(
		profile_id,
		conversation_id,
	);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: "Failed to create participant",
			message: error.message,
		};
		return;
	}

	ctx.status = 200;
	ctx.body = {
		status: true,
		data,
	};
});

router.post('/create-message', async (ctx: Context) => {
	const request_body = ctx.request.body as InsertMessage;
	const { conversation_id, sender_id, receiver_id, content } = request_body;

	const [data, error] = await MUTATIONS.createMessage(
		conversation_id,
		sender_id,
		receiver_id,
		content,
	);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: "Failed to create message",
			message: error.message,
		};
		return;
	}

	// Fetch all messages for the conversation
	const [messages, fetchError] = await QUERIES.fetchMessagesByConversationId(conversation_id);

	if (!fetchError && messages) {
		const result = await Promise.all(
			messages.map(async (message) => {
				let setMessage: Object = message;

				const [sender, senderError] = await PROFILE_QUERIES.fetchProfileWithId(message.sender_id);
				if (!senderError && sender) setMessage = { ...setMessage, sender: sender[0] };

				return setMessage;
			})
		);

		// Broadcast to all clients in this conversation
		wsServer.broadcastToConversation(conversation_id, result);
	}

	ctx.status = 200;
	ctx.body = {
		status: true,
		data,
	};
});

/**
 * Retrieve
 */

router.get("/fetch-all-converations-profile-id/:profile_id", async (ctx) => {
	const profile_id: SelectParticipant["profile_id"] = Number(ctx.params.profile_id);

	const [data, error] = await QUERIES.fetchAllConversationsByProfileId(profile_id);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: "Failed to fetch conversations",
			message: error.message,
		};
		return;
	}

	ctx.status = 200;
	ctx.body = {
		status: true,
		data,
	};
});

router.post("/fetch-some-converations-profile-id/:profile_id", async (ctx) => {
	const profile_id: SelectParticipant["profile_id"] = Number(ctx.params.profile_id);
	const request_body = ctx.request.body as { page: number, pageSize: number };
	const { page, pageSize } = request_body;

	const [data, error] = await QUERIES.fetchSomeConversationsByProfileId(
		profile_id,
		page,
		pageSize,
	);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: "Failed to fetch conversations",
			message: error.message,
		};
		return;
	}

	ctx.status = 200;
	ctx.body = {
		status: true,
		data,
	};
});

router.get("/fetch-converation/:id", async (ctx) => {
	const id: SelectConversation["id"] = Number(ctx.params.id);

	const [data, error] = await QUERIES.fetchConversationById(id);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: "Failed to fetch conversation",
			message: error.message,
		};
		return;
	}

	ctx.status = 200;
	ctx.body = {
		status: true,
		data,
	};
});

router.get("/fetch-most-recent-conversation", async (ctx) => {
	const [data, error] = await QUERIES.fetchMostRecentConversation();

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: "Failed to fetch conversation",
			message: error.message,
		};
		return;
	}

	ctx.status = 200;
	ctx.body = {
		status: true,
		data,
	};
});

router.post("/fetch-converation-with-profile-and-user-id", async (ctx) => {
	const request_body = ctx.request.body as {
		profile_id: SelectParticipant["profile_id"];
		user_id: SelectParticipant["profile_id"];
	};
	const { profile_id, user_id } = request_body;

	const [data, error] = await QUERIES.fetchConversationBetweenProfiles(profile_id, user_id);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: "Failed to fetch conversation",
			message: error.message,
		};
		return;
	}

	ctx.status = 200;
	ctx.body = {
		status: true,
		data,
	};
});

router.get("/fetch-participants-conversation-id/:conversation_id", async (ctx) => {
	const conversation_id: SelectParticipant["conversation_id"] = Number(ctx.params.conversation_id);

	const [data, error] = await QUERIES.fetchParticipantsByConversationId(conversation_id);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: "Failed to fetch participants",
			message: error.message,
		};
		return;
	}

	ctx.status = 200;
	ctx.body = {
		status: true,
		data,
	};
});

router.get("/fetch-participants-profile-id/:profile_id", async (ctx) => {
	const profile_id: SelectParticipant["profile_id"] = Number(ctx.params.profile_id);

	const [data, error] = await QUERIES.fetchParticipantsByProfileId(profile_id);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: "Failed to fetch participants",
			message: error.message,
		};
		return;
	}

	ctx.status = 200;
	ctx.body = {
		status: true,
		data,
	};
});

router.get("/fetch-messages/:conversation_id", async (ctx) => {
	const conversation_id: SelectMessage["conversation_id"] = Number(ctx.params.conversation_id);

	const [data, error] = await QUERIES.fetchMessagesByConversationId(conversation_id);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: "Failed to fetch messages",
			message: error.message,
		};
		return;
	}

	ctx.status = 200;
	ctx.body = {
		status: true,
		data,
	};
});

router.get("/fetch-profiles-without-conversation/:user_id", async (ctx) => {
	const user_id: SelectParticipant["profile_id"] = Number(ctx.params.user_id);

	const [data, error] = await QUERIES.fetchProfilesWithoutConversationWithUserId(user_id);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: "Failed to fetch profiles",
			message: error.message,
		};
		return;
	}

	ctx.status = 200;
	ctx.body = {
		status: true,
		data,
	};
});

/**
 * Update
 */

/**
 * Delete
 */

router.delete('/delete-conversation/:id', async (ctx) => {
	const id: SelectConversation["id"] = Number(ctx.params.id);

	const [data, error] = await MUTATIONS.deleteConversationsWithId(id);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: 'Failed to delete conversation',
			message: error.message,
		};
		return;
	}

	ctx.status = 200;
	ctx.body = {
		status: true,
		data,
	};
});

router.delete('/delete-participant/:id', async (ctx) => {
	const id: SelectParticipant["id"] = Number(ctx.params.id);

	const [data, error] = await MUTATIONS.deleteParticipantsWithId(id);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: 'Failed to delete participant',
			message: error.message,
		};
		return;
	}

	ctx.status = 200;
	ctx.body = {
		status: true,
		data,
	};
});

router.delete('/delete-message/:id', async (ctx) => {
	const id: SelectMessage["id"] = Number(ctx.params.id);

	const [data, error] = await MUTATIONS.deleteMessagesWithId(id);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: 'Failed to delete message',
			message: error.message,
		};
		return;
	}

	ctx.status = 200;
	ctx.body = {
		status: true,
		data,
	};
});

export default router;