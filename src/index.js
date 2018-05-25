import React from "react";
import ReactDOM from "react-dom";
import Bootstrap from "bootstrap/dist/css/bootstrap.css";
import { Button } from "react-bootstrap";
import styles from "./index.css";

function Square(props) {
  let styleSquare = {
    square: "square"
  };

  return (
    <button
      className={`${styleSquare.square} ${props.winnerStyle}`}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  //this.props.winner contains the array combination winning squares.Ex: [0,1,2] -> <Square 0>, <Square 1>, <Square 2>.
  renderSquare(i) {
    //var self = this;
    let match = () => {
      if (this.props.winner) {
        for (let j = 0; j < this.props.winner.length; j++) {
          console.log(i, j, +" " + i === j);
          if (i === this.props.winner[j]) {
            return true;
          }
        }
      }
    };
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        winnerStyle={match() ? "winnerColor" : "noColor"}
      />
    );
  }
  render() {
    let counter = 0;
    return [0, 1, 2].map(row => {
      return (
        <div key={row} className="board-row">
          {[0, 1, 2].map(() => {
            counter++;
            return this.renderSquare(counter - 1);
          })}
        </div>
      );
    });
  }
}

class Game extends React.Component {
  constructor() {
    super();
    //coordinates never change, so we set them up here
    this.coordinates = (function() {
      const arr = [];
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          arr.push("(" + i + ", " + j + ")");
        }
      }
      return arr;
    })();
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          space: ["N/A"] // Space dimension in history. History = space and time.
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      order: true
    };
  }

  handleClick(i) {
    //console.log(e.target);
    //i here means a selected button; NOT (for var i=0 ... etc)
    const coordinate = this.coordinates[i];
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          space: coordinate //keep track of space coordinate record (or history)
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    });
  }

  setOrder(change) {
    this.setState({
      order: change
    });
  }

  //
  render() {
    //These are strictly to display; nothing is changed here.
    //#2) We want to bold with respect to time.
    //Loop through buttons and bold button[selection].
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      //step === a piece of history; step.space === a piece of history at a particular coordinate.
      const desc = move
        ? "Go to move #" + move + " at " + step.space
        : "Go to game start";

      return (
        <li key={move}>
          <Button onClick={() => this.jumpTo(move)}>{desc}</Button>
        </li>
      );
    });
    const descOrder = () => {
      return (
        <Button onClick={() => this.setOrder(false)}>Descending Order</Button>
      );
    };
    const ascendOrder = () => {
      return (
        <Button onClick={() => this.setOrder(true)}>Ascending Order</Button>
      );
    };

    let status;
    if (winner) {
      status = "Winner: " + winner.player;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div>
        <div className="game">
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={i => this.handleClick(i)}
              winner={winner ? winner.line : ""}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{this.state.order ? moves : moves.reverse()}</ol>
          </div>
          <div className="toggle">
            {descOrder()}
            {ascendOrder()}
          </div>
        </div>
        <a href="https://odm275.github.io/portfolio/">Coded by Oscar Mejia</a>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { player: squares[a], line: [a, b, c] };
    }
  }
  return null;
}
