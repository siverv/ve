

## Vé
### Asynchronous server side rendering of [JSX](https://babeljs.io/docs/plugins/transform-react-jsx/) using [Koa](http://koajs.com/)

React's JSX is a pleasant enough way to write HTML, but when rendering server side, the whole shebang with states and JS-style attributes is needlessly complicated. Vé, named after the norse god which gave the original stick-figure-humans shapes and senses, is a small project to give simple JSX-support through Koa without distraction.

#### Configured for [Koa](http://koajs.com/)

The renderer is written with Koa's `ctx` and `next` in mind. While technically not a requirement, the alternative is to write your own middleware using `Ve.engine`, which takes a writable stream and the component to render as its first two arguments. All later arguments will be available to the component-functions.

```sh
npm install --save koa
```

#### Better with [Babel](https://babeljs.io/) and its [React/JSX transformation plugin](https://babeljs.io/docs/plugins/transform-react-jsx/)

```sh
npm install --save-dev babel-cli babel-plugin-transform-react-jsx
```

The difference between
```javascript
<div class="my-div">hello world</div>
```
and
```javascript
Ve.component("div", {class: "my-div"}, "hello world");
```
is quite noticable, after all.
#### Configure .babelrc

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


#### Use as middleware

```javascript
app.use(require('ve').engine)
```

#### Write HTML components with JSX
All attribute names are written in the usual HTML-way, using double quotes, with the value's double-quotes escaped. There is white-list of valid attribute names in in `Ve.config` taken from [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes) which determines what will be visible, also allowing `/^data-[\w-]*$/` and `/^on\w+$/`.

The configuration object also includes lists of empty elements (`br`, `input`, etc) which do not display its children, and preformatted elements (`textarea`, `pre`) which filters away non-string children.

```javascript
const Ve = require('ve');
async function MyDiv (ctx) {
  return <div {...this.attr} class={"my-div " + this.attr.class}>
    {this.children}
  </div>
}
```


#### All together

The following example can be found as `demo/demo.jsx`.

```javascript
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
```

And finally the source, as available to the browser:

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

    </style>
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
          to
          <i>
            you
          </i>
          as well
        </h3>
      </main>
      <footer>
        © 2018
      </footer>
    </div>
  </body>
</html>
```