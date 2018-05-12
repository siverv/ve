
const routes = new require('koa-router')();
const Ve = require('ve');
const fs = require('fs');

const examples = fs.readdirSync(__dirname).filter(file => file != "index.js");

const routeFromPath = (path) =>
  path.split("/").pop().replace(/\.js$/,'').replace(/\B([A-Z])/g,"-$1").toLowerCase();
const nameFromPath = (path) =>
  path.split("/").pop().replace(/\.js$/,'').replace(/\B([A-Z])/g," $1");
  

for(let path of examples){
  routes.get(routeFromPath(path), require("./"+path));
}


routes.get('/', function ListOfExamples (ctx) {
  ctx.state.source = __filename;
  ctx.state.title = "Examples - " + ctx.state.title;
  ctx.state.header = "Assorted examples of one sort or another" 
  return (
    <nav>
      {
        examples.map(path => {
          return <ul>
            <li>
              <a href={'./'+routeFromPath(path)}>{nameFromPath(path)}</a>
            </li>
          </ul>
        })
      }
    </nav>
  );
})


module.exports = routes.routes();

