const Koa = require('koa');
const Ve = require('../index.js');
 
async function Component (ctx) {
  ctx.state.title = "Component - " + ctx.state.title;
  await new Promise((ok) => setTimeout(ok, 100))
  return (
    <div class="component">
      <header>
        <h1>
          Hello World
        </h1>
      </header>
      <main data-name={'"you"'} custom-attributes="will be hidden by default">
        <Child name={"you"}> 
          Hello
        </Child>
      </main>
      <footer>
          &copy; 2018
      </footer>
    </div>
  )
}
 
function Child () {
  return <h3>
    {this.children}
    to
    <i>
      {this.attr.name}
    </i>
    as well
  </h3>
}
 
const app = new Koa();
app.use(Ve.render);
app.use(async (ctx, next) => {
  ctx.state.title = "Vé"
  let children = await next();
  return (
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>
          {ctx.state.title}
        </title>
        <style>
{`
.component {
  width: 250px;
  margin: 50px;
}
h1 {
  color: steelblue;
  font-weight: normal;
}
`}
        </style>
      </head>
      <body>
        {children}
      </body>
    </html>
  )
})
 
app.use(Component);
app.listen(3000);