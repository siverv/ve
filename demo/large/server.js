"use strict"
require('@babel/register');

const koa = require('koa');

const app = new koa();

app.use(require('koa-static')('./www/'));
app.use(require('koa-bodyparser')());

app.use(async (ctx, next) => {
  ctx.dbFile = __dirname + '/db/items.json';
  ctx.readmeFile = __dirname + '/readme.md';
  let time = Date.now();
  await next();
  console.log(ctx.request.path, "TIME", Date.now() - time);
})

app.use(require('./src/routes'));


app.listen(3000)
