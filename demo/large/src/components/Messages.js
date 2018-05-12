

const Ve = require('ve');

function Message (ctx) {
  let className = [
    'message',
    "-"+this.attr.type
  ].concat(this.attr.class||[]).join(" ")
  return (
    <div class={className} index={this.attr.index}>
      {this.attr.message}
    </div>
  )
}


module.exports = function Messages (ctx) {
  let ids = [].concat(this.attr.id||[]);
  let messages = ctx.state.messages;
  if(ids.length > 0 || !this.attr.all){
    messages = messages.filter(msg => msg && ids.includes(msg.for))
  }
  messages = messages.concat(this.attr.messages||[]);
  let className = ['messages'].concat(this.attr.class||[]).join(" ")
  return (
    <div class={className} for={ids}>
      {
        messages.map((msg) => <Message {...msg}/>)
      }
    </div>
  )
}
