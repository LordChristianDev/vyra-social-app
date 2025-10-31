import { Context } from 'koa';
import Router from '@koa/router';

import {
	InsertPost,
	SelectPost,
} from "@/db/schema";
import {
	QUERIES,
	MUTATIONS,
} from '@/modules/posts/server/post-server';

const router = new Router();

// Route Check
router.get('/', (ctx) => {
	ctx.body = { message: 'Post Route is Working!' };
});

/**
 * Create
 */

router.post('/create', async (ctx: Context) => {
	const request_body = ctx.request.body as {
		author_id: InsertPost["author_id"],
		content: InsertPost["content"],
		args: Object,
	};
	const { author_id, content, args } = request_body;

	const [data, error] = await MUTATIONS.createPost(
		author_id,
		content,
		args,
	);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: "Failed to create post",
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
	const [data, error] = await QUERIES.fetchPosts();

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: 'Failed to fetch all posts',
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

	const [data, error] = await QUERIES.fetchSomePosts(page, pageSize);


	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: 'Failed to fetch all posts',
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

router.get('/fetch-all-with-author-id/:author_id', async (ctx) => {
	const author_id: SelectPost["author_id"] = Number(ctx.params.author_id);

	const [data, error] = await QUERIES.fetchAllPostsWithAuthorId(author_id);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: 'Failed to fetch all posts',
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

router.post('/fetch-some-with-author-id/:author_id', async (ctx) => {
	const author_id: SelectPost["author_id"] = Number(ctx.params.author_id);
	const request_body = ctx.request.body as { page: number, pageSize: number };
	const { page, pageSize } = request_body;

	const [data, error] = await QUERIES.fetchSomePostsWithAuthorId(
		author_id,
		page,
		pageSize,
	);


	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: 'Failed to fetch some posts',
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

router.get('/fetch-tags', async (ctx) => {
	const [data, error] = await QUERIES.fetchTags();

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: 'Failed to fetch tags',
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

router.get('/fetch-trending-tags', async (ctx) => {
	const [data, error] = await QUERIES.fetchTrendingTags();

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: 'Failed to fetch trending tags',
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

router.get('/fetch-trending-categories', async (ctx) => {
	const [data, error] = await QUERIES.fetchTrendingCategories();

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: 'Failed to fetch trending categories',
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
	const id: SelectPost["id"] = Number(ctx.params.id);
	const request_body = ctx.request.body as { updates: object };
	const { updates } = request_body;

	const [data, error] = await MUTATIONS.updatePostWithId(
		id,
		updates,
	);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: 'Failed to update post',
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
	const id: SelectPost["id"] = Number(ctx.params.id);

	const [data, error] = await MUTATIONS.deletePostWithId(id);

	if (error) {
		ctx.status = 500;
		ctx.body = {
			status: false,
			error: 'Failed to delete post',
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