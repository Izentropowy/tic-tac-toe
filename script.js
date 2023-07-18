const dimension = 3;

const Field = (row, column) => {
    let value = '';
    let isEmpty = true;

    const toggleStatus = () => {
        isEmpty = false;
    }

    const getStatus = () => isEmpty;

    return {
        row,
        column,
        value,
        getStatus,
        toggleStatus,
    }
}

const Player = (token) => {
    let isWinner = false;
    let points = 0;

    const addPoint = () => {
        points += 1;
    }

    const toggleStatus = () => {
        isWinner = true;
    }

    const getStatus = () => isWinner;

    const getPoints = () => points;

    return {
        token,
        addPoint,
        toggleStatus,
        getPoints,
        getStatus,
    }
}

const gameboard = (() => {
    const _createEmptyBoard = () => {
        let newBoard = [];

        for (let i = 0; i < dimension; i++) {
            newBoard[i] = [];
            for (let j = 0; j < dimension; j++) {
                newBoard[i].push(Field(i, j));
            }   
        }
        return newBoard;
    }
    


    let board = _createEmptyBoard();

    const getBoard = () => board;

    const updateBoard = (oldBoard, row, column, player) => {
        oldBoard[row][column].value = `${player.token}`;
        oldBoard[row][column].toggleStatus();
        board = oldBoard;
        return board;
    }

    return {
        getBoard,
        updateBoard,
    };
})();

const gameController = (() => {
    const playerX = Player('x');
    const playerO = Player('o');
    let board = gameboard.getBoard();

    let activePlayer = playerX;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === playerX ? playerO : playerX;
    }

    const getActivePlayer = () => activePlayer;

    const playRound = (row, column) => {

        if (board[row][column].getStatus() == true) {
            gameboard.updateBoard(board, row, column, activePlayer);
            switchPlayerTurn();
        }

        console.log(board);
    }

    return {
        switchPlayerTurn,
        getActivePlayer,
        playRound,
    }
})();

const displayController = (() => {
    const buttons = document.querySelectorAll('.game-btn');

    const _assignData = (buttons) => {
        buttons.forEach((button, index) => {
            const i = Math.floor(index / dimension);
            const j = index % dimension;
            button.setAttribute('data-row', `${i}`);
            button.setAttribute('data-column', `${j}`);
        });
    };
    
    _assignData(buttons);

    buttons.forEach(button => button.addEventListener('click', () => 
    {
        let row = button.dataset.row;
        let column = button.dataset.column;
        let activeToken = gameController.getActivePlayer().token;
        gameController.playRound(row, column);
        button.classList.add(activeToken);
        button.disabled = true;
    }
    ));
})();


