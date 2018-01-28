import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function run_demo(root) {
  ReactDOM.render(<Board />, root);
}

// App state for Board is:
// {
//   tiles: [List of TileItem],
//   score: NonNegInteger
//   time: NonNegInteger
// }
//
// A TileItem is:
// {
//   value: String,
//   killed: Boolean,
//   reversed: Boolean,
//   pos: NonNegInteger
// }

class Board extends React.Component {
  nextPos(arr, idx) {
    let l = arr.length;
    while (arr[idx] == 1) {
      idx = (idx+1) % l;
    }
    return idx;
  }

  randomPos(l) {
    return Math.floor(Math.random()*l);
  }

  initialize() {
    let exists = Array(16).fill(0);
    let arrangeLetters = Array(16);

    for (let i = 0; i < 8; i++) {
      let letter = String.fromCharCode(65 + i);
      let pos = this.nextPos(exists, this.randomPos(16));
      let item = {
        value: letter,
        killed: false,
        reversed: false,
        pos: pos
      };
      arrangeLetters[pos] = item;
      exists[pos] = 1;
      pos = this.nextPos(exists, this.randomPos(16));
      let nextItem = {
        value: letter,
        killed: false,
        reversed: false,
        pos: pos
      };
      arrangeLetters[pos] = nextItem;
      exists[pos] = 1;
    }

    console.log(arrangeLetters);
    return arrangeLetters;
  }

  constructor(props) {
    super(props);
    this.state = {
      tiles: this.initialize(),
      score: 0,
      reversedTiles: []
    };
  }

// click a tile,
// judge current reversed tiles number and increment the clickTimes!
// if reversed tiles number == 0, reverse this and keep it reversed (change state)
// if reversed tiles number == 1, reverse this (quickly add this item into .reversedTiles)
// and stay 1 second
// --- after 1 second, check whether two reversed are same value
// --- if they are same value in .value field
// ------- make all these two, according to pos, as killed, clean .reversedTiles, add score, add clickTimes
// --- else if they are not same value in .value field
// ------- make them all reversed to false, clean .reversedTiles, add clickTimes
// if reversed tiles number >= 2, do nothing, just ignore

// if (numOfReversed == 0) {
//   let ti = _.map(this.state.tiles, (tile) => {
//     if (tile.pos == p && !tile.killed) {
//       return _.extend(tile, {reversed: !tile.reversed});
//     } else {
//       return tile;
//     }
//   });
// }


  handleClick(p) {
    let oldRTLength = 0;
    let reversedItemOne = {};
    let reversedItemTwo = {};
    let newRT = [];
    this.setState((prevState) => {
      let newTiles = [];
      let newScore = prevState.score;
      newRT = prevState.reversedTiles.slice();
      oldRTLength = newRT.length;
      console.log("in block " + newRT.length);
      newTiles = _.map(prevState.tiles, (tile) => {
        if (tile.pos === p) {
          console.log("turn up card at "+p);
          reversedItemOne = _.extend(tile, {reversed: true});
          newRT.push(reversedItemOne);
          return reversedItemOne;
        } else {
          return tile;
        }
      });
      newScore -= 8;
      console.log(newRT[0]);
      return {
        tiles: newTiles,
        score: newScore,
        reversedTiles: newRT
      };
    });

    console.log("out setState1 before setState2 " + newRT.length);
    _.delay(() => {
      console.log("in the delay block!");
      this.setState((previousState) => {
        let newTiles = previousState.tiles.slice();
        let newScore = previousState.score;
        newRT = previousState.reversedTiles.slice();
        console.log("setState2: " + newRT.length);
        if (newRT.length == 2) {
          let p1 = newRT[0].pos;
          let p2 = p;
          console.log("compare two tiles!");
          _.each(previousState.tiles, (tile) => {
            if (tile.pos === p1) {
              reversedItemOne = _.clone(tile);
            } else if (tile.pos === p2) {
              reversedItemTwo = _.clone(tile);
            }
          });
          // _.delay(() => {
          console.log("in the delay block!");
          if (reversedItemOne.value === reversedItemTwo.value) {
            newTiles = _.map(previousState.tiles, (tile) => {
              if (tile.value === reversedItemOne.value && !tile.killed) {
                return _.extend(tile, {killed: true});
              } else {
                return tile;
              }
            });
            newScore += 50;
          } else {
            newTiles = _.map(previousState.tiles, (tile) => {
              if (tile.pos === p1 || tile.pos === p2) {
                return _.extend(tile, {reversed: false});
              } else {
                return tile;
              }
            });
          }
        }

        return {
          tiles: newTiles,
          score: newScore,
          reversedTiles: []
        };
      })}, 1500);
  }

  render() {
    let tile_list = _.map(this.state.tiles, (tile, ii) => {
      return <TileItem item={tile} key={ii} clickTile={this.handleClick.bind(this)}/>;
    });
    return (
      <div id="ts">
        {tile_list}
        <br></br>
        <br></br>
        <p>Score: {this.state.score}</p>
      </div>
    );
  }
}

function TileItem(props) {
  let item = props.item;
  if (item.killed) {
    return <div className="tile-box"><span className="text">OK</span></div>;
  } else {
    if (item.reversed) {
      return <div className="tile-box" onClick={() => props.clickTile(item.pos)}><span className="text">{item.value}</span></div>;
    } else {
      return <div className="tile-box" onClick={() => props.clickTile(item.pos)}><span className="text">?</span></div>;
    }
  }
}

/*
class Demo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { side: props.side };
  }

  toggle(side) {
    var side = +!this.state.side;
    this.setState({side: side});
  }

  render() {
    var toggle = this.toggle.bind(this);
    return (
      <div className="row">
        <p>hellkkkko</p>
        <Side show={this.state.side == 0} toggle={toggle} />
        <div className="col">
          &nbsp;
        </div>
        <Side show={this.state.side == 1} toggle={toggle} />
      </div>
    );
  }
}

function Side(params) {
  if (params.show) {
    return (
      <div id="side-0" className="side col" onMouseOver={ () => params.toggle() }>
        <Button onClick={ () => alert("cheater") }>Click Me</Button>
      </div>
    );
  }
  else {
    return (
      <div id="side-0" className="side col">
        &nbsp;
      </div>
    );
  }
}
 */
