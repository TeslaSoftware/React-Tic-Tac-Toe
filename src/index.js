import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const BOARD_ROWS = 3;
const BOARD_COLS = 3;

function Square(props){
  let classes = "square";
   if(props.highlight){
    classes += " winning-square";
   }
    return (
        <button 
          className={classes} 
          onClick={props.onClick}
        >
          {props.value}
        </button>
    );
  }
  
  class Board extends React.Component {

    renderSquare(i) {
      let isWinningSquare = false;
      if(this.props.winningSquares){
        isWinningSquare = (this.props.winningSquares.includes(i));
      } 
      return <Square key={i}
      value={this.props.squares[i]}
      onClick ={() => this.props.onClick(i)}
      highlight ={isWinningSquare}
      />;
    }
  
    render() {
      let board = [];
      
      for(let i = 0; i < BOARD_ROWS; i++){
        let currentRow = [];
        for(let j = 0; j < BOARD_COLS; j++){
          currentRow.push(this.renderSquare(i*BOARD_ROWS + j));
        }
        board.push(<div key={i} className="board-row">{currentRow}</div>);
      }


      return (
        <div className="game-board">
          {board}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
        }],
        xIsNext: true,
        stepNumber: 0,
        reversedList: false,
      };
    }

    handleClick(i){
      const history = this.state.history.slice(0, this.state.stepNumber +1);
      const current = history[history.length -1];
      const squares = current.squares.slice();
      if(calculateWinner(squares) || squares[i]){
        return;
      }
      let row = Math.floor((i) / 3) +1;
      let col = (i%3) +1;
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares,
          row: row,
          col: col,
        }]),
        xIsNext: !this.state.xIsNext,
        stepNumber: history.length,
      });
    }

    jumpTo(step){
      console.log("jumping to state " + step);
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }

    reverseList(){
      this.setState({
        reversedList: !this.state.reversedList
      });
    }

    getWinningSquares(squares){
      const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
      for(let i = 0; i < lines.length;  i++){
        const [a, b, c] = lines[i];
        if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
          return lines[i];
        }
      }
      return null;
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);

      const winningSquares = this.getWinningSquares(current.squares);

     
      const moves = history.map((step, move) => {
        let desc = move ? 
          'Go to move #' + move + " . Row: " + step.row + ", Col: " + step.col : 
          'Go to game start';
          if(this.state.stepNumber === move) desc = <b>{desc} </b>;
          return this.state.stepNumber === move? (            
            <li key={move}>
              <button className="selected-move" onClick={() => this.jumpTo(move)}> 
                {desc} </button>
            </li>
          )
          :(            
            <li key={move}>
              <button onClick={() => this.jumpTo(move)}> 
                {desc} </button>
            </li>
          );
      })

      if(this.state.reversedList){
        moves.reverse();
      }

      let status;
      if(winner){
        status = 'Winner: ' + winner;
      }
      else if(this.state.stepNumber === 9){
        status = "It's a draw!"
      }
      else{
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
        <div className="game">
          <div>
            <Board 
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
              winningSquares = {winningSquares}
            />
          </div>
          <div className="game-info">
            <div className="status">{status}</div>
            <button id="reverse-order" onClick={() => this.reverseList()}>Reverse Order</button>
            <ol reversed={this.state.reversedList}>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  

  function calculateWinner(squares){
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for(let i =0; i < lines.length;  i++){
      const [a, b, c] = lines[i];
      if(squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
        return squares[a];
      }
    }
    return null;
  }