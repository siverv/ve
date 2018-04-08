
const koa = require('koa');

const app = new koa();

app.use(require('koa-static')('./www/'));
app.use(require('koa-bodyparser')());

app.use(async (ctx, next) => {
  ctx.dbFile = __dirname + '/db/items.json';
  ctx.readmeFile = __dirname + '/readme.md';
  await next();
})

app.use(require('./lib/routes'));


app.listen(3000)
