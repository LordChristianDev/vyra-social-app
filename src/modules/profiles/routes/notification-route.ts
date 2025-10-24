import Router from '@koa/router';
import { MUTATIONS, QUERIES } from '@/modules/profiles/server/notification-server';

const router = new Router();

// Route Check
router.get('/', (ctx) => {
	ctx.body = { message: 'Notification Route is Working!' };
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