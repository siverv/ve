const Koa = require('koa');
const Ve = require('koa-ve');

async function Component(ctx) {
  ctx.state.title = "Component - " + ctx.state.title;
  await new Promise(ok => setTimeout(ok, 100));
  return Ve.component(
    'div',
    { 'class': 'component' },
    Ve.component(
      'header',
      null,
      Ve.component(
        'h1',
        null,
        'Hello World'
      )
    ),
    Ve.component(
      'main',
      { 'data-name': '"you"', 'custom-attributes': 'will be hidden by default' },
      Ve.component(
        Child,
        { name: "you" },
        'Hello'
      )
    ),
    Ve.component(
      'footer',
      null,
      '\xA9 2018'
    )
  );
}

function Child() {
  return Ve.component(
    'h3',
    null,
    this.children,
    'to',
    Ve.component(
      'i',
      null,
      this.attr.name
    ),
    'as well'
  );
}

const app = new Koa();
app.use(Ve.render);
app.use(async (ctx, next) => {
  ctx.state.title = "Vé";
  let children = await next();
  return Ve.component(
    'html',
    null,
    Ve.component(
      'head',
      null,
      Ve.component('meta', { charset: 'utf-8' }),
      Ve.component(
        'title',
        null,
        ctx.state.title
      ),
      Ve.component(
        'style',
        null,
        `
.component {
  width: 250px;
  margin: 50px;
}
h1 {
  color: steelblue;
  font-weight: normal;
}
`
      )
    ),
    Ve.component(
      'body',
      null,
      children
    )
  );
});

app.use(Component);
app.listen(3000);
