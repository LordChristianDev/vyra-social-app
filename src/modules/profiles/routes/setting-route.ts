import Router from '@koa/router';
import { MUTATIONS, QUERIES } from '@/modules/profiles/server/setting-server';

const router = new Router();

// Route Check
router.get('/', (ctx) => {
	ctx.body = { message: 'Setting Route is Working!' };
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