
const routes = new require('koa-router')();
const Ve = require('ve');

const api = require('./api');
const views = require('./views');
const middleware = require('./middleware');

const {sanitize} = require('./utils');
routes.use(middleware.sanitizePostForm);
routes.use(Ve.render, 
  middleware.errorBoundary,
  middleware.appFrame
);


routes.post('/item', api.new, views.New);
routes.post('/item/:id', api.edit, views.Edit);

routes.get('/item', views.New);
routes.get('/item/:id', views.Edit);

routes.get('/items', views.List)
routes.get('/docs', views.Docs)
routes.get('/', views.Home);

routes.use('/examples/', views.examples)

module.exports = routes.routes();