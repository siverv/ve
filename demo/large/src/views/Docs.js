

const Ve = require('ve');
const {Markdown} = require('../components');

module.exports = function Docs (ctx) {
  ctx.state.source = __filename;
  ctx.state.title = "Documentation - " + ctx.state.title;
  ctx.state.header = <i>Documentation</i>;
  return (
    <div class="documentation">
      <Markdown file={ctx.readmeFile}/>
    </div>
  );
}