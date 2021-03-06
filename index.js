'use strict';

var config = {
  beautify: true,
  doctype: "<!DOCTYPE html>\n",
  voidElements: [
    'area','base','br','col','command','embed','hr','img','input',
    'keygen','link','menuitem','meta','param','source','track','wbr'
  ],
  preElements: ['pre', 'textarea'],
  validAttributeNames: [
    "accept","accept-charset","accesskey","action","align",
    "alt","async","autocapitalize","autocomplete","autofocus",
    "autoplay","bgcolor","border","buffered","challenge","charset",
    "checked","cite","class","code","codebase","color","cols","colspan",
    "content","contenteditable","contextmenu","controls","coords",
    "crossorigin","data",/^data-[\w-]*$/,"datetime","default","defer","dir",
    "dirname","disabled","download","draggable","dropzone","enctype",
    "for","form","formaction","headers","height","hidden","high","href",
    "hreflang","http-equiv","icon","id","integrity","ismap","itemprop",
    "keytype","kind","label","lang","language","list","loop","low","manifest",
    "max","maxlength","minlength","media","method","min","multiple","muted",
    "name","novalidate",/^on\w+$/,"open","optimum","pattern","ping","placeholder",
    "poster","preload","radiogroup","readonly","rel","required","reversed",
    "rows","rowspan","sandbox","scope","scoped","seamless","selected","shape",
    "size","sizes","slot","span","spellcheck","src","srcdoc","srclang",
    "srcset","start","step","style","summary","tabindex","target","title",
    "type","usemap","value","width","wrap"
  ]
}

const tagNameIsVoidElement = tagName => config.voidElements.includes(tagName);
const tagNameIsPreElement = tagName => config.preElements.includes(tagName);
const attributeNameIsValid = name => {
  return config.validAttributeNames.some(attr => {
    if(typeof attr === "string"){
      return attr === name;
    } else if(attr instanceof RegExp){
      return attr.test(name);
    }
  })
};

const escapeAttributeQuotes = (str) => String(str).replace(/"/g, "&quot;");
const constructTagString = (tagName, attr) => {
  let tagString = [tagName];
  for (let name in attr) {
    if(attributeNameIsValid(name)){
      if(typeof attr[name] == "boolean"){
        if(attr[name]){
          tagString.push(name);
        }
      } else if(attr[name] != null) {
        let value = escapeAttributeQuotes(attr[name]);
        tagString.push(name+'="'+value+'"');
      }
    }
  }
  return tagString.join(" ");
};

function ve_process (component, ctx) {
  let res = [];
  async function internal (item) {
    if(item == null){
      return;
    } else if(item.then){
      return item.then(internal);
    } else if(Array.isArray(item)) {
      if(item.length == 0){
        return;
      }
      let chain = internal(item[0]);
      for(let i = 1; i < item.length; i++){
        chain = chain.then(()=>internal(item[i]));
      }
      return chain;
    } else if(typeof item === "function"){
      return internal(item(ctx));
    } else if(typeof item === "boolean"); else {
      res.push(item);
    }
  }
  return internal(component).then(()=>res);
}

function ve_idem (ctx) {
  return this.children;
}
async function ve_try (ctx) {
  return await ve_process(this.children, ctx)
    .catch(err => {
      ctx.state.error = err;
      return this.attr.catch;
    })
}

function ve_void (ctx) {
  return '<' + constructTagString(this.tag, this.attr) + '/>';
}
function ve_pre (ctx) {
  let content = "";
  for(var i = 0; i < this.children.length; i++){
    content += this.children[i] || "";
  }
  return '<' + constructTagString(this.tag, this.attr) + '>' + content + '</' + this.tag + '>';
}
function ve_tag (ctx) {
  return [
    '<' + constructTagString(this.tag, this.attr) + '>',
    this.children,
    '</' + this.tag + '>'
  ]
}

function ve_component (tag, attr, ...children) {
  if(!tag){
    if(tag === undefined){
      throw ReferenceError("Undefined component tag");
    } else return null;
  } else if(tag === true) {
    return children;
  } else {
    let self = {
      tag: tag.name || String(tag),
      attr: attr || {},
      children,
    };
    if (tag.bind) {
      return tag.bind(self);
    } else if(tagNameIsVoidElement(tag)) {
      return ve_void.bind(self)
    } else if (tagNameIsPreElement(tag)) {
      return ve_pre.bind(self);
    } else {
      return ve_tag.bind(self);
    }
  }
}

async function ve_stringify (component, ctx) {
  let processed = await ve_process(component, ctx);
  return processed.join(" ");
}

async function ve_beautify (component, ctx) {
  let processed = await ve_process(component, ctx);
  let out = [];
  let indent = "";
  for(var i = 0; i < processed.length; i++){
    let part = processed[i];
    let match = part[0] === "<" && part[part.length-1] === ">";
    if(match && part[1] === "/"){
      indent = indent.slice(0,-2);
      match = false;
    }
    out.push(indent + part);
    if(match && part[part.length-2] !== "/"){
      indent += "  ";
    }
  }
  return out.join("\n");
}

async function ve_koa_middleware (ctx, next) {
  let render = config.beautify ? ve_beautify : ve_stringify;
  ctx.set('Content-Type', 'text/html; charset=utf-8');
  ctx.status = 200;
  let component = await next();
  if(component){
    let content = await render(component, ctx);
    ctx.body = config.doctype + content;
  }
}

var ve = {
  config,
  utils: {
    attributeNameIsValid,
    tagNameIsVoidElement,
    tagNameIsPreElement,
    constructTagString,
  },
  process: ve_process,
  component: ve_component,
  stringify: ve_stringify,
  beautify: ve_beautify,
  render: ve_koa_middleware,
  tag: ve_tag,
  pre: ve_pre,
  void: ve_void,
  idem: ve_idem,
  try: ve_try,
}

module.exports = ve;
