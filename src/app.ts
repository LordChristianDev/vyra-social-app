import Koa from 'koa';
import cors from '@koa/cors';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';
import 'dotenv/config';

import authRoutes from '@/modules/auth/routes/auth-route';

import notificationRoutes from '@/modules/profiles/routes/notification-route';
import profileRoutes from '@/modules/profiles/routes/profile-route';

const app = new Koa();
const router = new Router();

// Middleware
app.use(cors());
app.use(bodyParser());

// Health check
router.get('/', (ctx) => {
  ctx.body = { message: 'API is running' };
});

// -- Mount sub-routes
// Auth
router.use('/auth', authRoutes.routes(), authRoutes.allowedMethods());

// Profile
router.use('/notification', notificationRoutes.routes(), notificationRoutes.allowedMethods());
router.use('/profile', profileRoutes.routes(), profileRoutes.allowedMethods());

// Register routes
app.use(router.routes());
app.use(router.allowedMethods());

// Start server
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});