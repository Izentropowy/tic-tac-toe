const dimension = 3;

const Field = (row, column) => {
    let isEmpty = true;

    const toggleStatus = () => {
        isEmpty = false;
    }

    const getStatus = () => isEmpty;

    return {
        row,
        column,
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
    const createEmptyBoard = () => {
        let newBoard = [];

        for (let i = 0; i < dimension; i++) {
            newBoard[i] = [];
            for (let j = 0; j < dimension; j++) {
                newBoard[i].push(Field(i, j));
            }   
        }
        return newBoard;
    }
    
    let board = createEmptyBoard();

    const getBoard = () => board;

    const updateBoard = (oldBoard, row, column, player) => {
        oldBoard[row][column] = `${player.token}`;
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
    const board = gameboard.getBoard();

    let activePlayer = playerX;

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === playerX ? playerO : playerX;
    }

    const getActivePlayer = () => activePlayer;

    const playRound = (row, column) => {
        gameboard.updateBoard(board, row, column, activePlayer);
        switchPlayerTurn();
        console.log(board);
    }
    return {
        switchPlayerTurn,
        getActivePlayer,
        playRound,
    }
})();

const displayController = (() => {
    const fields = document.querySelectorAll('.game-btn');

    const assignData = (fields) => {
        fields.forEach((field, index) => {
            const i = Math.floor(index / dimension);
            const j = index % dimension;
            field.setAttribute('data-row', `${i}`);
            field.setAttribute('data-column', `${j}`);
        });
    };
    
    assignData(fields);

    fields.forEach(field => field.addEventListener('click', () => 
    {
        let row = field.dataset.row;
        let column = field.dataset.column;
        gameController.playRound(row, column);
    }
        ));
})();


