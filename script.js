
/* 
MODULES:
Gameboard():
    - creates empty board
    - updates board
    - checks available fields

Gamecontroller():
    - creates players
    - toggle active player
    - plays a round
    - looks for a winner

Displaycontroller():
    - displays values in corresponding fields
    - updates turn display
    - updates points display

FACTORIES:
Player():
    - name
    - token
    - points

Field():
    - value
    - change value
 */

const player = (name, token) => {
    let points = 0;

    const addPoint = () => {
        points += 1;
    }

    const getPoints = () => points;

    return {
        name,
        token,
        addPoint,
        getPoints,
    }
}

const field = () => {
    let value = '-';

    const changeValue = (newValue) => {
        value = newValue;
    }

    const getValue = () => value;

    return {
        changeValue,
        getValue,
    }
}

const gameboard = (() => {
    const board = [];

    const resetBoard = () => {
        for (let i = 0; i < 3; i++) {
            board[i] = [];
            for (let j = 0; j < 3; j++) {
                board[i].push(field());
            }
        }
    }

    resetBoard();

    const getBoard = () => board;

    const updateBoard = (row, column, player) => {
        board[row][column].changeValue(player.token);
    }

    return {
        getBoard,
        updateBoard,
        resetBoard,
    }
})();

const gamecontroller = (() => {
    const player1 = player('player1', 'x');
    const player2 = player('player2', 'o');

    let activePlayer = player1;
    const board = gameboard.getBoard();

    const _toggleActivePlayer = () => {
        activePlayer === player1 ? activePlayer = player2 : activePlayer = player1;
    }

    const getActivePlayer = () => activePlayer;

    const _findWinner = () => {
        const winningLines = [];
        let winner = false;
        const checkLine = (line) => {
            if (line === "xxx") {
                winner = player1;
            }
            else if (line === "ooo") {
                winner = player2;
            }
        }

          // Rows
        for (let i = 0; i < 3; i++) {
            const row = [];
            for (let j = 0; j < 3; j++) {
            row.push([i, j]);
            }
            winningLines.push(row);
        }

        // Columns
        for (let i = 0; i < 3; i++) {
            const column = [];
            for (let j = 0; j < 3; j++) {
            column.push([j, i]);
            }
            winningLines.push(column);
        }

          // Diagonals
        const diagonal1 = [];
        const diagonal2 = [];
        for (let i = 0; i < 3; i++) {
            diagonal1.push([i, i]);
            diagonal2.push([i, 3 - 1 - i]);
        }
        winningLines.push(diagonal1, diagonal2);

        winningLines.forEach(line => {
            // each line contains a winning line
            let checked = "";
            line.forEach((element) => {
                // each element contains coordinates [x, y]
                checked += board[element[0]][element[1]].getValue();
            });
            checkLine(checked);
            checked = "";
        });

        return winner;
    }

    const playRound = (row, column) => {
        gameboard.updateBoard(row, column, activePlayer);
        _toggleActivePlayer();
        if (_findWinner()) {
            gameboard.resetBoard();
            displaycontroller.resetDisplay();
        }
    }

    return {
        getActivePlayer,
        playRound,
    }
})();

const displaycontroller = (() => {
    const buttons = document.querySelectorAll('.game-btn');
    
    const _buttonClicked = (e) => {
        let row = e.target.dataset.row;
        let column = e.target.dataset.column;
        e.target.classList.add(gamecontroller.getActivePlayer().token);
        e.target.disabled = true;
        gamecontroller.playRound(row, column);
    }

    const resetDisplay = () => {
        buttons.forEach(button => {
            let buttonClass = button.classList.contains('x') ? 'x' : 'o';
            button.classList.remove(buttonClass);
            button.disabled = false;
        })
    }

    buttons.forEach(button => button.addEventListener('click', _buttonClicked));

    return {
        resetDisplay,
    }
})();