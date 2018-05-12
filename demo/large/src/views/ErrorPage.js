

const Ve = require('ve');
const {Messages} = require('../components');

module.exports = async function ErrorPage (ctx) {
  console.log(ctx.state.messages)
  ctx.state.title = ` Error ${ctx.state.error.status} - ` + ctx.state.title;
  ctx.state.header = "Something went unexpectedly wrong."
  return <Messages all={true}/>;
}