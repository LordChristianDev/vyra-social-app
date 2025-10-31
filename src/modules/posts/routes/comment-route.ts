import { Context } from 'koa';
import Router from '@koa/router';

import {
	InsertComment,
	SelectComment,
} from "@/db/schema";
import {
	QUERIES,
	MUTATIONS,
} from '@/modules/posts/server/comment-server';

const router = new Router();

// Route Check
router.get('/', (ctx) => {
	ctx.body = { message: 'Comment Route is Working!' };
});

/**
 * Create
 */

router.post('/create', async (ctx: Context) => {
	const request_body = ctx.request.body as InsertComment;
	const { post_id, author_id, content } = request_body;

	const [data, error] = await MUTATIONS.createComment(
		post_id,
		author_id,
		content,
	);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: "Failed to create comment",
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

router.get('/fetch-all/:post_id', async (ctx) => {
	const post_id: SelectComment["post_id"] = Number(ctx.params.post_id);
	const [data, error] = await QUERIES.fetchCommentsWithPostId(post_id);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: 'Failed to fetch all comments',
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

router.post('/fetch-some/:post_id', async (ctx) => {
	const post_id: SelectComment["post_id"] = Number(ctx.params.post_id);
	const request_body = ctx.request.body as { page: number, pageSize: number };
	const { page, pageSize } = request_body;

	const [data, error] = await QUERIES.fetchSomeCommentsWithPostId(
		post_id,
		page,
		pageSize
	);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: 'Failed to fetch some comments',
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
	const id: SelectComment["id"] = Number(ctx.params.id);
	const request_body = ctx.request.body as { updates: object };
	const { updates } = request_body;

	const [data, error] = await MUTATIONS.updateCommentWithId(
		id,
		updates,
	);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: 'Failed to update comment',
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
	const id: SelectComment["id"] = Number(ctx.params.id);

	const [data, error] = await MUTATIONS.deleteCommentWithId(id);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: 'Failed to delete comment',
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