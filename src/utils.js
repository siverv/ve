
import config from './config';

export const tagNameIsVoidElement = tagName => config.voidElements.includes(tagName)
export const tagNameIsPreElement = tagName => config.preElements.includes(tagName)
export const attributeNameIsValid = name => {
  return config.validAttributeNames.some(attr => {
    if(typeof attr === "string"){
      return attr === name;
    } else if(attr instanceof RegExp){
      return attr.test(name);
    }
  })
}

export const escapeAttributeQuotes = (str) => String(str).replace(/"/g, "&quot;");
export const constructTagString = (tagName, attr) => {
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
}