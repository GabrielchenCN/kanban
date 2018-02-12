const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const koaBody = require('koa-body');

router.post('/users', koaBody(),
  (ctx) => {
    console.log(ctx.request.body);
    // => POST body
    ctx.body = JSON.stringify(ctx.request.body);
  }
);

app.use(router.routes());

app.listen(3000);
console.log('curl -i http://localhost:3000/users -d "name=test"');