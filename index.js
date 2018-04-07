const stream = require('stream');
const config = require('./config');
const {
  attributeNameIsValid,
  tagNameIsVoidElement,
  tagNameIsPreElement,
  constructTagString,
  isString,
  indent
} = require('./utils');

let i = 0;
const Ve = {
  void: function(ctx){
    return ctx.__ve__.emit(`<${constructTagString(this.tag, this.attr)}/>`);
  },
  pre: function(ctx){
    return ctx.__ve__.emit(`<${constructTagString(this.tag, this.attr)}>${this.children}</${this.tag}>`)
  },
  tag: async function(ctx){
    ctx.__ve__.emit(`<${constructTagString(this.tag, this.attr)}>`);
    if(this.children){
      ctx.__ve__.depth++;
      await Ve.process.apply({component: this.children}, arguments);
      ctx.__ve__.depth--;
    }
    ctx.__ve__.emit(`</${this.tag}>`);
  },
  component: (tag, attr, ...children) => {
    if(!tag){
      if(tag === undefined){
        throw ReferenceError("Undefined component tag");
      } else return null;
    } else {
      let self = {
        tag: String(tag),
        attr: attr || {},
        children,
      };
      let tagType;
      if (typeof tag === "function") {
        tagType = tag;
        self.tag = tag.name;
      } else if(tagNameIsVoidElement(tag)) {
        tagType = Ve.void;
        self.children = [];
      } else if (tagNameIsPreElement(tag)) {
        tagType = Ve.pre
        self.children = [].concat(self.children||[]).filter(isString).join('')
      } else if(isString(tag)){
        tagType = Ve.tag
      } else {
        throw TypeError("Unrecognized component tag: " + tag + " of type " + typeof tag);
      }
      return tagType.bind(self)
    }
  },
  process: async function (ctx) {
    component = await this.component;
    if(!component || component === global){
      return null;
    } else if(isString(component)){
      return ctx.__ve__.emit(component);
    } else if(component.apply){
      let children = await component.apply({}, arguments);
      if(children){
        await Ve.process.apply({component: children}, arguments);
      }
    } else if(typeof component[Symbol.iterator] === "function") {
      for(let child of component){
        await Ve.process.apply({component: child}, arguments);
      }
    } else if(typeof component !== 'object') {
      return ctx.__ve__.emit(String(component));
    } else {
      throw TypeError('Invalid component: ' + String(component) + " of type " + typeof component)
    }
  },
  engine: async function (stream, component, ctx = {}, ...args) {
    ctx.__ve__ = {
      depth: 0,
      emit: (chunk) => {
        if(stream.writable){
          stream.write(indent(ctx.__ve__.depth) + chunk);
        }
      }
    };
    await Ve.process.call({component}, ctx, ...args);
    return stream;
  },
  koa: async function (ctx, next) {
    ctx.set('Content-Type', 'text/html; charset=utf-8')
    ctx.status = 200
    ctx.body = stream.PassThrough();
    ctx.body.write(config.doctype)
    let component = await next();
    await Ve.engine(ctx.body, component, ...arguments);
    ctx.body.end();
  }
}

module.exports = {
  config: config,
  render: Ve.koa,
  engine: Ve.engine,
  component: Ve.component,
}