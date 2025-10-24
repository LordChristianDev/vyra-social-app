import Router from '@koa/router';
import { MUTATIONS, QUERIES } from '@/modules/profiles/server/profile-server';

const router = new Router();

// Route Check
router.get('/', (ctx) => {
	ctx.body = { message: 'Profile Route is Working!' };
});

/**
 * Create
 */

/**
 * Retrieve
 */

/**
 * Update
 */

/**
 * Delete
 */