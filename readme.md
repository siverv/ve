

## Vé
### Asynchronous stringification of [JSX](https://babeljs.io/docs/plugins/transform-react-jsx/)

React's JSX is a pleasant enough way to write HTML, but when rendering server side, the whole shebang with states and JS-style attributes is needlessly complicated and not particularily suitable for asynchronous functions. Vé, named after the norse god who gave the original stick-figure-humans shapes and senses, is a small project to give simple async JSX-support on the server.

An earlier version exists on npm as `koa-ve`, but as it has been made into a more general method of rendering as strings, this will not be updated. No new package on npm has been planned as of yet.

#### Made for use with [Koa](http://koajs.com/)

The renderer is written with Koa's `ctx` and `next` in mind. This is not a requirement, as both `ve.stringify` and `ve.beautify` are available to give you the resulting HTML as plain strings with and without indentation, but this requires you to supply your own `ctx` object. At the moment, only the optional `ve.try` uses this object internally, and that is simply to set `ctx.state.error` in the event of a caught error.

###### Use as middleware

```javascript
app.use(require('ve').render)
```

#### Better with [Babel](https://babeljs.io/) and its [React/JSX transformation plugin](https://babeljs.io/docs/plugins/transform-react-jsx/)


The difference between
```jsx
<div class="my-div">hello world</div>
```
and
```javascript
Ve.component("div", {class: "my-div"}, "hello world");
```
is quite noticable, after all.

###### Configure .babelrc

```json
{
  "plugins": [
    ["transform-react-jsx",
      {
        "pragma": "Ve.component"
      }
    ]
  ],
}
```

If using Babel 7, there is fragment support using `"pragmaFrag": "true"`. Otherwise, fragments are supported easily enough by `const Fragment = true;`, as using booleans as tags allowed.

#### Write HTML components with JSX
All attribute names are written in the usual HTML-way, using double quotes, with the value's double-quotes escaped. There is white-list of valid attribute names in `Ve.config` taken from [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes) which determines what will be visible, also allowing `/^data-[\w-]*$/` and `/^on\w+$/`.

The configuration object also includes lists of tag-names for empty elements (`br`, `input`, etc) which do not display its children, and preformatted elements (`textarea`, `pre`) which filters away non-string children.

```jsx
const Ve = require('ve');
async function MyDiv (ctx) {
  return <div {...this.attr} class={"my-div " + this.attr.class}>
    {this.children}
  </div>
}
```


#### All together

The following example can be found as `small-demo/demo.jsx`.

```jsx
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
```

And finally the source, as available to the browser with `ve.beautify`:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8"/>
    <title>
      Component - Vé
    </title>
    <style>
      
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

    </style>
    <script>
      
function MakeBlue (element) {
  if(element.classList.contains("blue")){
    element.classList.remove("blue");
  } else {
    element.classList.add("blue");
  }
}

    </script>
  </head>
  <body>
    <div class="component">
      <header>
        <h1>
          Hello World
        </h1>
      </header>
      <main data-name="&quot;you&quot;">
        <h3>
          Hello
          <div>
            <b>
              hello
            </b>
            <i>
              hello
            </i>
            <u>
              hello
            </u>
          </div>
          to
          <i>
            you
          </i>
          as well
        </h3>
        <button class="blueable" onClick="MakeBlue(this)">
          Blue
        </button>
      </main>
      <footer>
        © 2018
      </footer>
    </div>
  </body>
</html>
```
