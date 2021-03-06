

const Ve = require('ve');

module.exports = function Home (ctx) {
  ctx.state.source = __filename;
  ctx.state.title = "Index - " + ctx.state.title;
  ctx.state.header = "Examples of Forms and Lists" 
  return (
    <nav>
      <ul>
        <li>
          <a href="/item">New Item</a>
        </li>
        <li>
          <a href="/items">All Items</a>
        </li>
        <li>
          <a href="/docs">Documentation</a>
        </li>
        <li>
          <a href="/examples/">Examples</a>
        </li>
      </ul>
    </nav>
  );
}