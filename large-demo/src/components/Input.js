const Ve = require('koa-ve');
const Messages = require('./Messages');

function InputGeneric(){
  let id = this.attr.id || this.attr.name;
  return (
    <div class={"input -"+this.attr.type}>
      <label for={id}>
        {this.attr.label}
      </label>
      <input {...this.attr} id={id}/>
      <Messages id={id}/>
    </div>
  )
}

function InputDate(){
  let id = this.attr.id || this.attr.name;
  return (
    <div class={"input -date"}>
      <label for={id}>
        {this.attr.label}
      </label>
      <input pattern="[0-9]{4}-[0-1]?[0-9]-[0-3]?[0-9]" placeholder="yyyy-mm-dd"
        {...this.attr} id={id}/>
      <Messages id={id}/>
    </div>
  )
}

function InputGroup(){
  return (
    <div class="input-group">
      <legend>
        {this.attr.legend || this.attr.label}
      </legend>
      {this.children}
    </div>
  )
}

function Checkbox(){
  let id = this.attr.id || this.attr.name;
  if(this.attr.index !== undefined){
    id = id + "-" + this.attr.index;
  }
  return (
    <div class={"checkbox -"+this.attr.type}>
      <input {...this.attr} id={id}/>
      <label for={id}>
        {this.attr.label}
      </label>
      {id && <Messages id={id}/>}
    </div>
  )
}

function CheckboxGroup(ctx){
  let legend = this.attr.legend || this.attr.label;
  let options = this.attr.options || [];
  let ids = [].concat(
    this.attr.id || this.attr.name || []
  ).concat(
    options.map(opt => opt.id || opt.name).filter(Boolean)
  );
      
  return (
    <InputGroup legend={legend}>
      {
        options.map( (opt, index) => {
          let checked;
          if(opt.hasOwnProperty('name') && !opt.hasOwnProperty('value')){
            opt.value = "1"
          }
          if(opt.hasOwnProperty("name") && ctx.state.body.hasOwnProperty(opt.name)){
            let value = ctx.state.body[opt.name]
            checked = opt.hasOwnProperty("value") ? value == opt.value : Boolean(value);
          } else if(opt.hasOwnProperty("value")){
            if(Array.isArray(this.attr.value)){
              checked = this.attr.value.includes(opt.value);
            } else {
              checked = opt.value == this.attr.value;
            }
          }
          return <Checkbox {...this.attr} index={index} {...opt} checked={checked}/>
        })
      }
      {ids && <Messages id={ids}/>}
    </InputGroup>
  )
}

function Option(){
  return <option {...this.attr}>
    {this.attr.label || this.attr.value}
  </option>
}

function Select(){
  let id = this.attr.name;
  let options = this.attr.options || [];
  return (
    <div class={"input -select"}>
      <label for={id}>
        {this.attr.label}
      </label>
      <select {...this.attr}>
        {
          options.map( opt => {
            let selected = undefined;
            if(opt.value == this.attr.value){
              selected = "selected"
            }
            return <Option {...this.attr} {...opt} selected={selected}/>
          })
        }
      </select>
      <Messages id={id}/>
    </div>
  )
}

function Textarea(){
  let id = this.attr.name;
  return (
    <div class={"input -textarea"}>
      <label for={id}>
        {this.attr.label}
      </label>
      <textarea {...this.attr}>{this.attr.value}</textarea>
      <Messages id={id}/>
    </div>
  )
}


function Immutable(){
  let attr = Object.assign({}, this.attr);
  if(attr.value && attr.value.label){
    attr.value = attr.value.label;
  }
  if(attr.type == "select"){
    attr.type = "text";
  }
  return (
    <div class={"input immutable -"+attr.type}>
      <label>
        {attr.label}
      </label>
      {attr.type == "textarea" ? 
        <textarea {...attr} disabled="true" style="resize:none">{(emit)=>attr.value && emit(attr.value)}</textarea>
        :
        <input {...attr} disabled="true"/>
      }
    </div>
  );
}



module.exports = function Input(ctx){
  let attr = Object.assign({}, this.attr);
  if(ctx.state.body.hasOwnProperty(attr.name)){
    attr.value = ctx.state.body[attr.name];
  }
  if(attr.immutable){
    return <Immutable {...attr}/>;
  }
  switch(attr.type){
    case 'select': 
      return <Select {...attr}/>;
    case 'textarea':
      return <Textarea {...attr}/>;
    case 'checkbox':
      if(!attr.options){
        attr = Object.assign({options: [attr]}, attr);
      }
    case 'radio':
      return <CheckboxGroup {...attr}/>;
    case 'date':
      return <InputDate {...attr}/>
    default:
      return <InputGeneric {...attr}/>;
  }
}