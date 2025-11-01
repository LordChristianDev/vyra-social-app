import { Context } from 'koa';
import Router from '@koa/router';

import {
	InsertNotification,
	SelectNotification,
} from '@/db/schema';

import {
	QUERIES,
	MUTATIONS,
} from '@/modules/profiles/server/notification-server';

const router = new Router();

// Route Check
router.get('/', (ctx) => {
	ctx.body = { message: 'Notification Route is Working!' };
});

/**
 * Create
 */

router.post('/create', async (ctx: Context) => {
	const request_body = ctx.request.body as InsertNotification;
	const { author_id, recipient_id, content, type } = request_body;

	const [data, error] = await MUTATIONS.createNotification(
		author_id,
		recipient_id,
		content,
		type,
	);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: "Failed to create notification",
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
 * Retrieve
 */

router.get('/fetch-all', async (ctx) => {
	const [data, error] = await QUERIES.fetchAllNotifications();

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: 'Failed to fetch notifications',
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

router.post('/fetch-some', async (ctx) => {
	const request_body = ctx.request.body as { page: number, pageSize: number };
	const { page, pageSize } = request_body;

	const [data, error] = await QUERIES.fetchSomeNotifications(page, pageSize);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: 'Failed to fetch notifications',
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

router.get('/fetch-all-with-user-id/:user_id', async (ctx) => {
	const user_id: SelectNotification["recipient_id"] = Number(ctx.params.user_id);

	const [data, error] = await QUERIES.fetchNotificationsWithUserId(user_id);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: 'Failed to fetch notifications',
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

router.post('/fetch-some-with-user-id/:user_id', async (ctx) => {
	const user_id: SelectNotification["recipient_id"] = Number(ctx.params.user_id);

	const request_body = ctx.request.body as { page: number, pageSize: number };
	const { page, pageSize } = request_body;

	const [data, error] = await QUERIES.fetchSomeNotificationsWithUserId(
		user_id,
		page,
		pageSize,
	);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: 'Failed to fetch notifications',
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

router.put('/update/:id', async (ctx) => {
	const id: SelectNotification["id"] = Number(ctx.params.id);

	const [data, error] = await MUTATIONS.updateNotificationReadWithId(id);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: 'Failed to update notifications',
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
 * Delete
 */

router.delete('/delete/:id', async (ctx) => {
	const id: SelectNotification["id"] = Number(ctx.params.id);

	const [data, error] = await MUTATIONS.deleteNotificationWithId(id);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: `Failed to delete notification`,
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