import Koa from 'koa';
import cors from '@koa/cors';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import serve from 'koa-static';
import send from 'koa-send';
import path from 'path';

import 'dotenv/config';

import authRoutes from '@/modules/auth/routes/auth-route';
import messageRoutes from '@/modules/messages/routes/message-route';
import postRoutes from '@/modules/posts/routes/post-route';
import commentRoutes from '@/modules/posts/routes/comment-route';
import notificationRoutes from '@/modules/profiles/routes/notification-route';
import profileRoutes from '@/modules/profiles/routes/profile-route';
import settingRoutes from '@/modules/profiles/routes/setting-route';

const app = new Koa();
const router = new Router();

// Middleware
app.use(cors());
app.use(bodyParser());

// API Routes with /api prefix
const apiRouter = new Router({ prefix: '/api' });

// Health check
apiRouter.get('/', (ctx) => {
  ctx.body = { message: 'API is running' };
});

// Mount sub-routes under /api
apiRouter.use('/auth', authRoutes.routes(), authRoutes.allowedMethods());
apiRouter.use('/message', messageRoutes.routes(), messageRoutes.allowedMethods());
apiRouter.use('/post', postRoutes.routes(), postRoutes.allowedMethods());
apiRouter.use('/comment', commentRoutes.routes(), commentRoutes.allowedMethods());
apiRouter.use('/notification', notificationRoutes.routes(), notificationRoutes.allowedMethods());
apiRouter.use('/profile', profileRoutes.routes(), profileRoutes.allowedMethods());
apiRouter.use('/setting', settingRoutes.routes(), settingRoutes.allowedMethods());

// Register API routes FIRST (important!)
app.use(apiRouter.routes());
app.use(apiRouter.allowedMethods());

// Serve static React files
const clientPath = path.join(__dirname, '../../client/dist');
console.log('📁 Serving client from:', clientPath);
app.use(serve(clientPath));

// SPA fallback - serve index.html for all non-API routes
app.use(async (ctx) => {
  // Skip if it's an API route
  if (ctx.path.startsWith('/api')) {
    return;
  }

  // Skip if it's a file with extension (like .js, .css, .png)
  if (ctx.path.includes('.') && !ctx.path.endsWith('/')) {
    return;
  }

  // Serve index.html for React Router
  try {
    await send(ctx, 'index.html', { root: clientPath });
  } catch (err) {
    console.error('❌ Error serving index.html:', err);
    ctx.status = 404;
    ctx.body = 'Not found';
  }
});

// Start server
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
  console.log(`🌐 Client available at http://localhost:${PORT}`);
});