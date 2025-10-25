import { Context } from 'koa';
import Router from '@koa/router';

import {
	InsertNotificationSettings,
	SelectNotificationSettings,
	InsertPrivacySettings,
	SelectPrivacySettings,
} from '@/db/schema';

import {
	QUERIES,
	MUTATIONS,
} from '@/modules/profiles/server/setting-server';

const router = new Router();

// Route Check
router.get('/', (ctx) => {
	ctx.body = { message: 'Setting Route is Working!' };
});

/**
 * Create
 */

router.post('/create-notification-settings/:user_id', async (ctx) => {
	const user_id: InsertNotificationSettings["user_id"] = Number(ctx.params.user_id);

	const [data, error] = await MUTATIONS.createNotificationSettingsWithUserId(user_id);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: `Failed to create notification settings`,
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

router.post('/create-privacy-settings/:user_id', async (ctx) => {
	const user_id: InsertPrivacySettings["user_id"] = Number(ctx.params.user_id);

	const [data, error] = await MUTATIONS.createPrivacySettingsWithUserId(user_id);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: `Failed to create privacy settings`,
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

router.get('/fetch-notification-settings/:user_id', async (ctx) => {
	const user_id: number = Number(ctx.params.user_id);

	const [data, error] = await QUERIES.fetchNotificationSettingsWithUserId(user_id);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: `Failed to fetch notification settings`,
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

router.get('/fetch-privacy-settings/:user_id', async (ctx) => {
	const user_id: number = Number(ctx.params.user_id);

	const [data, error] = await QUERIES.fetchPrivacySettingsWithUserId(user_id);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: `Failed to fetch privacy settings`,
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

router.put("/update-notifications-settings/:user_id", async (ctx) => {
	const user_id: number = Number(ctx.params.user_id);
	const request_body = ctx.request.body as { updates: object };
	const { updates } = request_body;

	const [data, error] = await MUTATIONS.updateNotificationSettingsWithUserId(
		user_id,
		updates,
	);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: `Failed to update notification settings`,
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

router.put("/update-privacy-settings/:user_id", async (ctx) => {
	const user_id: number = Number(ctx.params.user_id);
	const request_body = ctx.request.body as { updates: object };
	const { updates } = request_body;

	const [data, error] = await MUTATIONS.updatePrivacySettingsWithUserId(
		user_id,
		updates,
	);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: `Failed to update privacy settings`,
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

router.delete('/delete-notification-settings/:user_id', async (ctx) => {
	const user_id: SelectNotificationSettings["user_id"] = Number(ctx.params.user_id);

	const [data, error] = await MUTATIONS.deleteNotificationSettingsWithUserId(user_id);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: 'Failed to delete notification settings',
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

router.delete('/delete-privacy-settings/:user_id', async (ctx) => {
	const user_id: SelectPrivacySettings["user_id"] = Number(ctx.params.user_id);

	const [data, error] = await MUTATIONS.deletePrivacySettingsWithUserId(user_id);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: 'Failed to delete privacy settings',
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