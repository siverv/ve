

const Ve = require('ve');
const {Messages, Input} = require('../components')

module.exports = async function New (ctx) {
  ctx.state.source = __filename;
  ctx.state.title = "New Item - " + ctx.state.title;
  ctx.state.header = "New Item";
  let date = (new Date()).toISOString().slice(0,10);
  return (
    <form method="POST">
      <Messages id="action"/>
      <Input type="text" name="name" label="Name" placeholder="Name..."/>
      <Input type="password" name="password" label="Password" placeholder="Password..."/>
      <Input type="date" name="date" label="Date" value={date} max={date}/>
      <Input type="checkbox" label="Independent checkboxes" options={[
        {name: 'red', label: "Red"},
        {name: 'green', label: "Green"},
        {name: 'blue', label: "Blue"},
      ]}/>
      <Input type="checkbox" name="checkbox" label="Dependent checkboxes" options={[
        {value: 'red', label: "Red"},
        {value: 'green', label: "Green"},
        {value: 'blue', label: "Blue"},
      ]}/>
      <Input type="radio" name="radio" label="Radio buttons" options={[
        {value: 'red', label: "Red"},
        {value: 'green', label: "Green"},
        {value: 'blue', label: "Blue"},
      ]}/>
      <Input type="select" name="select" label="Select" options={[
        {value: 'red', label: "Red"},
        {value: 'green', label: "Green"},
        {value: 'blue', label: "Blue"},
      ]}/>
      <Input type="textarea" name="textarea" label="Textarea"/>
      <button class="submit" name="action" value="submit">
        Submit
      </button>
      <button class="cancel" name="action" value="cancel">
        Cancel
      </button>
    </form>
  );
}