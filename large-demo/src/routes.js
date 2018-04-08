
const routes = new require('koa-router')();
const Ve = require('koa-ve');

routes.use(require('koa-ve').render);

const api = require('./api');
const views = require('./views');

const {sanitize} = require('./utils');
routes.use(async function sanitizePostForm (ctx, next) {
  let keys = Object.getOwnPropertyNames(ctx.request.body);
  for(let key of keys){
    let value = ctx.request.body[key];
    if(typeof value === "string"){
      value = sanitize(value);
    } else if(Array.isArray(value)){
      value = value.map(sanitize);
    }
    ctx.request.body[key] = value;
  }
  return await next();
})



routes.use(async (ctx, next) => {
  try {
    return await next();
  } catch (err) {
    console.log(err)
    ctx.status = err.status || 500;
    ctx.state.error = err;
    ctx.body = err.message;
    ctx.state.messages.push(
      {type: 'error', message: `${ctx.status}: ${err.message}`}
    )
    // ctx.app.emit('error', err, ctx);
    return Ve.render(
      ctx,
      () => views.Error(ctx)
    )
  }
});

routes.use(Ve.render, views.App);


routes.post('/item', api.new, views.New);
routes.post('/item/:id', api.edit, views.Edit);

routes.get('/item', views.New);
routes.get('/item/:id', views.Edit);

routes.get('/items', views.List)
routes.get('/docs', views.Docs)
routes.get('/', views.Home);

module.exports = routes.routes();