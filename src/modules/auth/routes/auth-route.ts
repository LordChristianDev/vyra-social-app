import Router from '@koa/router';
import { MUTATIONS, QUERIES } from '@/modules/auth/server/auth-server';

const router = new Router();

//  Route Check
router.get('/', (ctx) => {
	ctx.body = { message: 'Auth Route is Working!' };
});

/**
 * Create
 */

router.post('/create', async (ctx) => {
	const uid: string = String(ctx.params.uid);

	const [data, error] = await MUTATIONS.createUser(uid);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: `Failed to create user with ${uid}`,
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
	const [data, error] = await QUERIES.fetchUsers();

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: 'Failed to fetch users',
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
	const id: number = Number(ctx.params.id);

	const [data, error] = await QUERIES.fetchUserWithId(id);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: `Failed to fetch user with ${id}`,
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

router.get('/fetch-uid/:uid', async (ctx) => {
	const uid: string = String(ctx.params.uid);

	const [data, error] = await QUERIES.fetchUserWithUid(uid);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: `Failed to fetch user with ${uid}`,
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

// router.put('/:id', (ctx) => {
// 	ctx.body = { message: `Update user ${ctx.params.id}` };
// });

/**
 * Delete
 */

router.delete('/delete-id/:id', async (ctx) => {
	const id: number = Number(ctx.params.id);

	const [data, error] = await MUTATIONS.deleteUserWithId(id);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: `Failed to delete user with ${id}`,
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

router.delete('/delete-uid/:id', async (ctx) => {
	const uid: string = String(ctx.params.uid);

	const [data, error] = await MUTATIONS.deleteUserGoogleUid(uid);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: `Failed to delete user with ${uid}`,
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