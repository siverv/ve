
const {fetchJson, writeJson} = require('../actions');

module.exports = async function editNew (ctx, next) {
  let body = Object.assign({}, ctx.state.body);
  if(body.action == 'cancel'){
    return ctx.redirect('/items');
  }
  body.id = ctx.params.id;
  let items = await fetchJson(ctx.dbFile);
  let index = items.findIndex(item => item.id == body.id);
  if(index < 0){
    return await next();
  }
  if(body.action != 'submit'){
    if(body.action == 'delete'){
      items.splice(index, 1);
      await writeJson(ctx.dbFile, items);
      return ctx.redirect('/items');
    }
    return await next();
  }
  let item = Object.assign(
    items[index],
    body,
    {name: items[index].name}
  );
  items.splice(index, 1, item)
  await writeJson(ctx.dbFile, items);
  ctx.state.messages.push(
    {type: 'success', for: 'action', message: `item edited`}
  )
  return await next();
}