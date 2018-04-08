

const Ve = require('koa-ve');
const {fetchJson} = require('../actions');

function Item (ctx) {
  return <a href={"/item/" + encodeURIComponent(this.attr.id)}>
    <div>
      <b>{this.attr.name}</b>
      <span>
        {`(${this.attr.date})`}
      </span>
    </div>
    <div>
      {this.attr.textarea}
    </div>
  </a>
}


module.exports = async function List (ctx) {
  ctx.state.source = __filename;
  ctx.state.title = "All Items - " + ctx.state.title;
  ctx.state.header = "All Items";
  let items = await fetchJson(ctx.dbFile);
  return (
    <ul>
      {items.map(item => <li><Item {...item}/></li>)}
    </ul>
  );
}