import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

interface SquareProps {
    value: string,
    onClick: VoidFunction,
}

function Square(props: SquareProps) {
    return (
        <button className="square" onClick={props.onClick} >
            {props.value}
        </button>
    );
}

// Component<T>: T <= propsの型
class Board extends React.Component<{ squares: string[], onClick: (i: number) => void }, {}> {
    renderSquare(i: number) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component<{}, { history: string[][], stepNumber: number, xIsNext: boolean }> {
    constructor(props) {
        super(props);

        this.state = {
            history: [Array<string>(9).fill(null)],
            stepNumber: 0, // 今何手目か
            xIsNext: true,
        }
    }

    handleClick(i: number) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.slice();
        if (calculateWinner(squares) || squares[i] != null) {
            return;
        }

        if (this.state.xIsNext) {
            squares[i] = "X";
        } else {
            squares[i] = "O";
        }

        this.setState({
            // concat : 配列の結合, 履歴の更新
            // historyの後ろにsquareをくっつけてる
            history: history.concat([squares]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step: number) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    render() {
        const history = this.state.history;
        const currentSquare = history[this.state.stepNumber];
        const winner = calculateWinner(currentSquare);
        let status; // 手番表示用

        // 過去の手順を表示させる関数
        // step : 現在要素, move : 現在要素のindex
        const moves = history.map((step: any, move) => {
            let desc;
            if (move)
                desc = "Go to move #" + move;
            else
                desc = "Go to move start";

            return (
                <li key={move}>
                    <button
                        onClick={() => this.jumpTo(move)}
                    >{desc}</button>
                </li>
            )
        })

        if (winner != null) {
            status = "Winner is " + winner;
        } else {
            let nextPlayer;
            if (this.state.xIsNext) {
                nextPlayer = "X";
            } else {
                nextPlayer = "O";
            }
            status = 'Next player: ' + nextPlayer;
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={currentSquare}
                        onClick={(i: number) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div className="status">{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares: Array<string>) {
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
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        // ==       : 等しい
        // ===      : 厳密に等しい(データ型の変換を行わない)
        // Example  : ("5" == 5) == true, ("5" === 5) == false
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}


// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
