

const Ve = require('ve');
const {Messages} = require('../../components');
const {fetchJson} = require('../../actions');

function Verse (ctx) {
  return <p>
    {this.attr.nr} bottles of beer on the wall.
    Take on down, pass it around.
    {this.attr.nr-1} bottles of beer on the wall.
  </p>
}

module.exports = async function BottlesOfBeerOnTheWall (ctx) {
  ctx.state.source = __filename;
  ctx.state.title = "10k Bottles - " + ctx.state.title;
  ctx.state.header = "10k bottles of beer on the wall";
  return (
    <div>
      {[...Array(1e4)].map(
        (_,bottle,bottles) => <Verse nr={bottles.length - bottle}/>
      )}
    </div>
  );
}