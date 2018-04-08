
const {fetchJson, writeJson} = require('../actions');

module.exports = async function newItem (ctx, next) {
  let body = Object.assign({}, ctx.state.body);
  if(body.action != 'submit'){
    if(body.action == 'cancel'){
      return ctx.redirect('/');
    }
    return await next();
  }
  if(!body.name){
    ctx.state.messages.push(
      {type: 'error', message: 'name has to be filled', for: 'name'}
    )
    return await next();
  }
  if(body.name.length < 5){
    ctx.state.messages.push(
      {type: 'warning', message: 'a bit short name, don\'t you think?', for: 'name'}
    )
  }
  
  body.id = body.name.toLowerCase().replace(/\s+/g, '-')
  let items = await fetchJson(ctx.dbFile);
  let exists = items.some(item => item.id == body.id);
  if(exists){
    ctx.state.messages.push(
      {type: 'error', message: 'name is already in use', for: 'name'}
    )
    return await next();
  }
  items.push(body)
  await writeJson(ctx.dbFile, items);
  ctx.state.messages.push(
    {
      type: 'success',
      for: 'action',
      message: `new item <a href="/item/${encodeURIComponent(body.id)}">${body.name}</a> created`
    }
  )
  return await next();
}