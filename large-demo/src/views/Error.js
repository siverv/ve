

const Ve = require('koa-ve');
const {Messages} = require('../components');
const App = require('./App');
module.exports = async function ErrorPage (ctx) {
  console.log(ctx.state.messages)
  return App(ctx, () => {
    ctx.state.title = ` Error ${ctx.state.error.status} - ` + ctx.state.title;
    ctx.state.header = "Something went unexpectedly wrong."
    return <Messages all={true}/>;
  });
}