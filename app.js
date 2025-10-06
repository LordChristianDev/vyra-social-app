// server.js
import Koa from 'koa';
import cors from '@koa/cors';
import Router from '@koa/router';
import bodyParser from 'koa-bodyparser';

const app = new Koa();
const router = new Router();

// Middleware
app.use(cors());
app.use(bodyParser());

// Sample routes
router.get('/', (ctx) => {
  ctx.body = { message: 'Hello from Koa!' };
});

router.post('/echo', (ctx) => {
  ctx.body = {
    received: ctx.request.body,
  };
});

// Register routes
app.use(router.routes());
app.use(router.allowedMethods());

// Start server
const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
