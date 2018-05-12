module.exports = async function sanitizePostForm (ctx, next) {
  let keys = Object.getOwnPropertyNames(ctx.request.body);
  for(let key of keys){
    let value = ctx.request.body[key];
    if(typeof value === "string"){
      value = sanitize(value);
    } else if(Array.isArray(value)){
      value = value.map(sanitize);
    }
    ctx.request.body[key] = value;
  }
  return await next();
}