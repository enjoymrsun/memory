import React from 'react';
import ReactDOM from 'react-dom';
import { Button } from 'reactstrap';

export default function run_demo(root) {
  ReactDOM.render(<Board />, root);
}

// App state for Board is:
// {
//   tiles: [List of TileItem],
//   score: NonNegInteger,
//   reversedTiles: [List of TileItem]
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
    this.updateState = this.updateState.bind(this);
    this.state = {
      tiles: this.initialize(),
      score: 0,
      reversedTiles: []
    };
  }

  updateState(newVersionTiles, newVersionScore) {
    this.setState((prevState) => {
      return {
        tiles: newVersionTiles,
        score: newVersionScore,
        reversedTiles: []
      };
    });
  }

  handleClick(p) {
    this.setState((prevState) => {
      let newTiles = prevState.tiles;
      let newScore = prevState.score;
      let newRT = prevState.reversedTiles.slice();
      newTiles = _.map(prevState.tiles, (tile) => {
        if (tile.pos === p) {
          let rt = _.extend(tile, {reversed: true});
          newRT.push(rt);
          return rt;
        } else {
          return tile;
        }
      });
      newScore -= 8;
      console.log("Re render for first setState!");
      return {
        tiles: newTiles,
        score: newScore,
        reversedTiles: newRT
      };
    });

    // use to make that timeout
    this.setState((previousState) => {
      let newTiles = previousState.tiles;
      let newScore = previousState.score;
      let newRT = previousState.reversedTiles.slice();
      console.log("Second setState, newRT length: " + newRT.length);
      if (newRT.length == 2) {
        window.setTimeout(() => {
          console.log("We are in the setTimeout function");
          console.log("newRT length after Timeout: " + newRT.length);
          console.log("after Timeout Number1 rt is: " + newRT[0].value);
          console.log("after Timeout Number2 rt is: " + newRT[1].value);
          if (newRT[0].value === newRT[1].value) {
            console.log("We have two same value tile!");
            newTiles = _.map(previousState.tiles, (tile) => {
              if (tile.value === newRT[0].value) {
                return _.extend(tile, {killed: true});
              } else {
                return tile;
              }
            });
            newScore += 50;
            console.log("After we kill two tiles: ");
            console.log(newTiles);
            console.log("After kill two tiles, we get: " + newScore);
          } else {
            console.log("We Don't have two same value tile!");
            newTiles = _.map(previousState.tiles, (tile) => {
              if (tile.pos === newRT[0].pos || tile.pos === newRT[1].pos) {
                return _.extend(tile, {reversed: false});
              } else {
                return tile;
              }
            });
          }
          console.log("We now can re render the component");
          console.log("Before re render, the score is: " + newScore);
          console.log("Before re render, the tiles are: ");
          console.log(newTiles);
          // updateState(newTiles, newScore);
        }, 1000);
        console.log("Outside Timeout Number1 rt is: " + newRT[0].value);
        console.log("Outside Timeout Number2 rt is: " + newRT[1].value);
      } else {
        console.log("One in here when only one is reversed.");
        return {
        };
      }
    });

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
