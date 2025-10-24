import Router from '@koa/router';
import { MUTATIONS, QUERIES } from '@/modules/posts/server/post-server';

const router = new Router();

// Route Check
router.get('/', (ctx) => {
	ctx.body = { message: 'Post Route is Working!' };
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