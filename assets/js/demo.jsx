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
//   reversedTiles: [List of TileItem],
//   clickTimes: NonNegInteger
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

    return arrangeLetters;
  }

  constructor(props) {
    super(props);
    this.reset = this.reset.bind(this);
    this.state = {
      tiles: this.initialize(),
      score: 0,
      reversedTiles: [],
      clickTimes: 0
    };
  }

  reset() {
    this.setState(() => {
      return {
        tiles: this.initialize(),
        score: 0,
        reversedTiles: [],
        clickTimes: 0
      };
    });
  }

  handleClick(p) {
    this.setState((prevState) => {
      let newTiles = prevState.tiles;
      let newScore = prevState.score;
      let newRT = prevState.reversedTiles.slice();
      let newCT = prevState.clickTimes;
      if (newRT.length <= 1) {
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
      }
      newCT += 1;
      return {
        tiles: newTiles,
        score: newScore,
        reversedTiles: newRT,
        clickTimes: newCT
      };
    });

    window.setTimeout(() => {
      this.setState((pState) => {
        let newTiles = pState.tiles;
        let newScore = pState.score;
        let newRT = pState.reversedTiles.slice();
        if (newRT.length == 2) {
          if (newRT[0].value === newRT[1].value && newRT[0].pos != newRT[1].pos) {
            newTiles = _.map(pState.tiles, (tile) => {
              if (tile.value === newRT[0].value) {
                return _.extend(tile, {killed: true});
              } else {
                return tile;
              }
            });
            newScore += 80;
          } else {
            newTiles = _.map(pState.tiles, (tile) => {
              if (tile.pos === newRT[0].pos || tile.pos === newRT[1].pos) {
                return _.extend(tile, {reversed: false});
              } else {
                return tile;
              }
            });
          }
          newRT = [];
        }
        return {
          tiles: newTiles,
          score: newScore,
          reversedTiles: newRT
        };
      });
    }, 2000);
  }

  render() {
    let tile_list_1 = _.map(this.state.tiles.slice(0, 4), (tile, ii) => {
      return <TileItem item={tile} key={ii} clickTile={this.handleClick.bind(this)}/>;
    });

    let tile_list_2 = _.map(this.state.tiles.slice(4, 8), (tile, ii) => {
      return <TileItem item={tile} key={ii} clickTile={this.handleClick.bind(this)}/>;
    });
    let tile_list_3 = _.map(this.state.tiles.slice(8, 12), (tile, ii) => {
      return <TileItem item={tile} key={ii} clickTile={this.handleClick.bind(this)}/>;
    });
    let tile_list_4 = _.map(this.state.tiles.slice(12, 16), (tile, ii) => {
      return <TileItem item={tile} key={ii} clickTile={this.handleClick.bind(this)}/>;
    });
    return (
      <div className="container">
        <div className="row">{tile_list_1}</div>
        <div className="row">{tile_list_2}</div>
        <div className="row">{tile_list_3}</div>
        <div className="row">{tile_list_4}</div>
        <div className="row"><p>Score: {this.state.score}</p></div>
        <div className="row"><p># of Click: {this.state.clickTimes}</p></div>
        <div className="row"><ResetButton reset={this.reset.bind(this)} /></div>
      </div>
    );
  }
}

function ResetButton(props) {
  return <Button onClick={props.reset}>RESET</Button>;
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
