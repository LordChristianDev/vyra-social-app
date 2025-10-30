import { Context } from 'koa';
import Router from '@koa/router';

import {
	InsertProfile,
	SelectProfile,
} from "@/db/schema";

import {
	QUERIES,
	MUTATIONS,
} from '@/modules/profiles/server/profile-server';

const router = new Router();

// Route Check
router.get('/', (ctx) => {
	ctx.body = { message: 'Profile Route is Working!' };
});

/**
 * Create
 */

router.post('/create', async (ctx: Context) => {
	const request_body = ctx.request.body as InsertProfile;
	const { user_id, first_name, last_name, avatar_url } = request_body;

	const [data, error] = await MUTATIONS.createProfile(
		user_id,
		first_name,
		last_name,
		avatar_url,
	);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: "Failed to create profile",
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
	const [data, error] = await QUERIES.fetchProfiles();

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: 'Failed to fetch profiles',
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

	const [data, error] = await QUERIES.fetchSomeProfiles(page, pageSize);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: 'Failed to fetch profiles',
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

router.get('/fetch-id/:id', async (ctx) => {
	const id: SelectProfile["id"] = Number(ctx.params.id);

	const [data, error] = await QUERIES.fetchProfileWithId(id);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: 'Failed to fetch profile',
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

router.get('/fetch-user-id/:user_id', async (ctx) => {
	const user_id: SelectProfile["user_id"] = Number(ctx.params.user_id);

	const [data, error] = await QUERIES.fetchProfileWithUserId(user_id);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: 'Failed to fetch profile',
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

router.get('/fetch-username/:username', async (ctx) => {
	const username: SelectProfile["username"] = String(ctx.params.username);

	const [data, error] = await QUERIES.fetchProfileWithUsername(username);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: 'Failed to fetch profile',
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

router.get('/fetch-all-suggested/:user_id', async (ctx) => {
	const user_id: SelectProfile["user_id"] = Number(ctx.params.user_id);

	const [data, error] = await QUERIES.fetchAllSuggestedProfiles(user_id);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: 'Failed to fetch profiles',
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

router.post('/fetch-some-suggested/:user_id', async (ctx) => {
	const user_id: SelectProfile["user_id"] = Number(ctx.params.user_id);
	const request_body = ctx.request.body as { page: number, pageSize: number };
	const { page, pageSize } = request_body;

	const [data, error] = await QUERIES.fetchSomeSuggestedProfiles(
		user_id,
		page,
		pageSize
	);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: 'Failed to fetch profiles',
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

router.put('/update-profile-user-id/:user_id', async (ctx) => {
	const user_id: SelectProfile["user_id"] = Number(ctx.params.user_id);
	const request_body = ctx.request.body as { updates: object };
	const { updates } = request_body;

	console.log("This is request body", request_body);

	const [data, error] = await MUTATIONS.updateProfileWithUserId(
		user_id,
		updates,
	);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: 'Failed to update profile',
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

router.put('/update-avatar-user-id/:user_id', async (ctx) => {
	const user_id: SelectProfile["user_id"] = Number(ctx.params.user_id);
	const request_body = ctx.request.body as { avatar_url: SelectProfile["avatar_url"] };
	const { avatar_url } = request_body;

	const [data, error] = await MUTATIONS.updateProfileAvatarWithUserId(
		user_id,
		avatar_url,
	);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: 'Failed to update profile',
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

router.put('/update-cover-user-id/:user_id', async (ctx) => {
	const user_id: SelectProfile["user_id"] = Number(ctx.params.user_id);
	const request_body = ctx.request.body as { cover_url: SelectProfile["cover_url"] };
	const { cover_url } = request_body;

	const [data, error] = await MUTATIONS.updateProfileCoverWithUserId(
		user_id,
		cover_url,
	);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: 'Failed to update profile',
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

router.delete('/delete-user-id/:user_id', async (ctx) => {
	const user_id: SelectProfile["user_id"] = Number(ctx.params.user_id);

	const [data, error] = await MUTATIONS.deleteProfileWithUserId(user_id);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: 'Failed to delete profile',
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