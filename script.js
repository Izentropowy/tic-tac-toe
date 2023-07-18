
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
    const dimension = 3;
    const board = [];

    for (let i = 0; i < dimension; i++) {
        board[i] = [];
        for (let j = 0; j < dimension; j++) {
            board[i].push(field());
        }
    }

    const getBoard = () => board;

    const updateBoard = (row, column, player) => {
        board[row][column].changeValue(player.token);
    }

    return {
        getBoard,
        updateBoard,
    }
})();

const gamecontroller = (() => {
    const player1 = player('player1', 'x');
    const player2 = player('player2', 'o');

    let activePlayer = player1;

    const _toggleActivePlayer = () => {
        activePlayer === player1 ? activePlayer = player2 : activePlayer = player1;
    }

    const getActivePlayer = () => activePlayer;

    const playRound = (row, column) => {
        gameboard.updateBoard(row, column, activePlayer);
        _toggleActivePlayer();
        console.log(gameboard.getBoard()[0][0].getValue());
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
        gamecontroller.playRound(row, column);
    }

    buttons.forEach(button => button.addEventListener('click', _buttonClicked));
})();