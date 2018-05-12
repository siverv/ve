
const Ve = require('ve');
const {Messages, Markdown} = require('../components');

module.exports = async function AppFrame(ctx, next) {
  ctx.state.body = ctx.request.body;
  ctx.state.messages = ctx.state.messages || [];
  ctx.state.breadcrumbs = ctx.state.breadcrumbs || [];
  ctx.state.title = "Vé";
  ctx.state.header;
  
  let showSource = ctx.query && ctx.query.source == "1";
  // If predicatives are capitalized, one could use them as a tag
  let IsShowingSource = showSource; 
  ctx.state.source = __filename;
  
  let children = await next();
  
  console.log(ctx.state.source)
  return (
    <html>
      <head>
        <meta charset="utf-8"/>
        <title>
          {ctx.state.title}
        </title>
        <link rel="stylesheet" type="text/css" href="/main.css"/>
      </head>
      <body>
        <header>
          <h1>
            <a href="/">
              Vé
            </a>
          </h1>
          <h3>
            {
              ctx.state.header ?
                typeof ctx.state.header === "string" ? 
                  ctx.state.header : <ctx.state.header/>
              : "Examples of forms and lists"
            }
          </h3>
        </header>
        <main>
          <Messages id="global"/>
          {children}
          <IsShowingSource>
            <div class="source">
              <Markdown file={ctx.state.source} wrapper={(str) => {
                let code = '```'
                return `### Source code\n ${code}javascript\n${str}\n${code}`;
              }}/>
            </div>
          </IsShowingSource>
        </main>
        <footer>
          &copy; 2018 | 
            { showSource ?
              <a href="?">hide source</a>  
              : 
              <a href="?source=1">show source</a>
            }
        </footer>
      </body>
    </html>
  );
}