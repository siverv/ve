const Ve = require('ve');
const {ErrorPage} = require('../views/');

function Catch(ctx){
  let err = ctx.state.error;
  ctx.status = err.status || 500;
  ctx.state.error = err;
  ctx.body = err.message;
  ctx.state.messages.push(
    {type: 'error', message: `${ctx.status}: ${err.message}`}
  )
  return <ErrorPage/>
}

module.exports = async (ctx, next) => {
  return <Ve.try catch={<Catch/>}>
    {await next()}
  </Ve.try>;
}