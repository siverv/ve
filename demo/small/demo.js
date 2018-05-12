const Ve = require('ve');

async function B(ctx) {
  await new Promise(ok => setTimeout(ok, 20));
  return Ve.component(true, null, Ve.component("b", null, "hello"), Ve.component("i", null, "hello"), Ve.component("u", null, "hello"));
}

function A(ctx) {
  return new Promise(ok => setTimeout(() => ok(Ve.component(B, null)), 10));
}

function Child(ctx) {
  return Ve.component("h3", null, this.children, "to", Ve.component("i", null, this.attr.name), "as well");
}

async function Component(ctx) {
  ctx.state.title = "Component - " + ctx.state.title;
  await new Promise(ok => setTimeout(ok, 100));
  return Ve.component("div", {
    "class": "component"
  }, Ve.component("header", null, Ve.component("h1", null, "Hello World")), Ve.component("main", {
    "data-name": '"you"',
    "custom-attributes": "will be hidden by default"
  }, Ve.component(Child, {
    name: "you"
  }, "Hello", Ve.component("div", null, Ve.component(A, null))), Ve.component("button", {
    "class": "blueable",
    onClick: "MakeBlue(this)"
  }, "Blue")), Ve.component("footer", null, "\xA9 2018"));
}

const Frame = async (ctx, next) => {
  ctx.state.title = "Vé";
  let children = await next();
  return Ve.component("html", null, Ve.component("head", null, Ve.component("meta", {
    charset: "utf-8"
  }), Ve.component("title", null, ctx.state.title), Ve.component("style", null, `
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
`), Ve.component("script", null, `
function MakeBlue (element) {
  if(element.classList.contains("blue")){
    element.classList.remove("blue");
  } else {
    element.classList.add("blue");
  }
}
`)), Ve.component("body", null, children));
};

const Koa = require('koa');

const app = new Koa();
app.use(Ve.render);
app.use(Frame);
app.use(Component);
app.listen(3000);
