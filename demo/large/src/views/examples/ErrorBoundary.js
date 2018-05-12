

const Ve = require('ve');
const {Messages} = require('../../components');
const {fetchJson} = require('../../actions');

function FaultyComponent (ctx) {
  throw Error("oh no!");
}

function InCaseOfTrouble (ctx) {
  let err = ctx.state.error;
  return <>
    <Messages messages={[
      {type: "error", message: String(err)}
    ]}/>
  </>
}

module.exports = async function ErrorBoundaryDemo (ctx) {
  ctx.state.source = __filename;
  ctx.state.title = "Error Boundary - " + ctx.state.title;
  ctx.state.header = "Error Boundary";
  return (
    <div>
      <h3>
        Everything is
        <Ve.try catch={InCaseOfTrouble}>
          <FaultyComponent>
            fine
          </FaultyComponent>
        </Ve.try>
      </h3>
    </div>
  );
}