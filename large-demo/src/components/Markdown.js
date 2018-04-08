

const Ve = require('koa-ve');

const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt();

module.exports = async function Markdown (ctx) {
  if(!this.attr.file){
    return null;
  }
  let content = String(await readFile(this.attr.file));
  if(this.attr.wrapper){
    content = this.attr.wrapper(content);
  }
  return md.render(content);
}
