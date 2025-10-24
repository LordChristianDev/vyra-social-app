import Router from '@koa/router';
import { MUTATIONS, QUERIES } from '@/modules/messages/server/message-server';

const router = new Router();

// Route Check
router.get('/', (ctx) => {
	ctx.body = { message: 'Message Route is Working!' };
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