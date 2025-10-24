import Router from '@koa/router';
import { MUTATIONS, QUERIES } from '@/modules/posts/server/comment-server';

const router = new Router();

// Route Check
router.get('/', (ctx) => {
	ctx.body = { message: 'Comment Route is Working!' };
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