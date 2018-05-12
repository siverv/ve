const Ve = require('ve');
 
async function B (ctx) {
  await new Promise((ok) => setTimeout(ok, 20));
  return <>
    <b>hello</b>
    <i>hello</i>
    <u>hello</u>
  </>
}

function A (ctx) {
  return new Promise(
    (ok) => setTimeout(() => ok(<B/>), 10)
  );
}

function Child (ctx) {
  return <h3>
    {this.children}
    to
    <i>
      {this.attr.name}
    </i>
    as well
  </h3>
}

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
          <div>
            <A/>
          </div>
        </Child>
        <button class="blueable" onClick="MakeBlue(this)">
          Blue
        </button>
      </main>
      <footer>
          &copy; 2018
      </footer>
    </div>
  )
}
 
 
const Frame = async (ctx, next) => {
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
.blue {
  border: 2px solid black;
  background-color: steelblue;
  color: white;
}
.blueable:after { content: "?"; }
.blue:after { content: "!"; }
`}
        </style>
        <script>
{`
function MakeBlue (element) {
  if(element.classList.contains("blue")){
    element.classList.remove("blue");
  } else {
    element.classList.add("blue");
  }
}
`}
        </script>
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}

const Koa = require('koa');
const app = new Koa();
app.use(Ve.render);
app.use(Frame);
app.use(Component);
app.listen(3000);

