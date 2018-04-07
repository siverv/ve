
const config = require('./config');

const tagNameIsVoidElement = tagName => config.voidElements.includes(tagName)
const tagNameIsPreElement = tagName => config.preElements.includes(tagName)
const attributeNameIsValid = name => {
  return config.validAttributeNames.some(attr => {
    if(typeof attr === "string"){
      return attr === name;
    } else if(attr instanceof RegExp){
      return attr.test(name);
    }
  })
}

const escapeAttributeQuotes = (str) => String(str).replace(/"/g, "&quot;");
const constructTagString = (tagName, attr) => {
  let tagString = tagName;
  for (let name in attr) {
    if(attributeNameIsValid(name)){
      if(typeof attr[name] == "boolean"){
        if(attr[name]){
          tagString += " " + name;
        }
      } else if(typeof attr[name] != 'undefined') {
        let value = escapeAttributeQuotes(attr[name]);
        tagString += ` ${name}="${value}"`;
      }
    }
  }
  return tagString;
}


const isString = object => 
  Object.prototype.toString.call(object) === "[object String]";

const indent = (depth) =>
  '\n' + (config.beautify ? [...Array(depth+1)].join('  ') : '')



module.exports = {
  attributeNameIsValid,
  tagNameIsVoidElement,
  tagNameIsPreElement,
  escapeAttributeQuotes,
  constructTagString,
  isString,
  indent,
}