
const player = (name, token) => {
    let points = 0;

    const addPoint = () => {
        points += 1;
    }

    const getPoints = () => points;

    const resetPoints = () => {
        points = 0;
    }

    return {
        name,
        token,
        addPoint,
        getPoints,
        resetPoints,
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
    const player1 = player('player1', 'X');
    const player2 = player('player2', 'O');

    let activePlayer = player1;
    const board = gameboard.getBoard();

    const _toggleActivePlayer = () => {
        activePlayer === player1 ? activePlayer = player2 : activePlayer = player1;
    }

    const getActivePlayer = () => activePlayer;

    const _findWinner = () => {
        const winningLines = [];
        let winner = false;
        const checkLine = (line, buttons) => {
            if (line === "XXX") {
                winner = player1;
            }
            else if (line === "OOO") {
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
            let buttons = [];
            line.forEach((element) => {
                // each element contains coordinates [x, y]
                checked += board[element[0]][element[1]].getValue();
                buttons.push(element);
            });
            checkLine(checked,buttons);
            checked = "";
        });

        return winner;
    }

    const resetAll = () => {
        displaycontroller.resetDisplay();
        gameboard.resetBoard()
        displaycontroller.toggleModal();
    }

    const playRound = (row, column) => {
        gameboard.updateBoard(row, column, activePlayer);
        _toggleActivePlayer();
        if (_findWinner()) {
            let winner = _findWinner()
            winner.addPoint();
            displaycontroller.adjustMessage(winner);
            displaycontroller.addPoints();
            resetAll();
            _toggleActivePlayer();
        }
    }

    return {
        player1,
        player2,
        getActivePlayer,
        playRound,
        resetAll,
    }
})();

const displaycontroller = (() => {
    const buttons = document.querySelectorAll('.game-btn');
    const modal = document.querySelector('.modal');
    const restartButton = document.getElementById('restart');
    const nextRoundButton = document.getElementById('next-round');
    const turnDisplay = document.querySelector('.turn-display');
    const undo = document.querySelector('.undo');
    const pointsX = document.querySelector('.player-x-points');
    const pointsO = document.querySelector('.player-o-points');
    const message = document.querySelector('.message');
    const player1 = gamecontroller.player1;
    const player2 = gamecontroller.player2;

    const _buttonClicked = (e) => {
        let row = e.target.dataset.row;
        let column = e.target.dataset.column;
        e.target.classList.add(gamecontroller.getActivePlayer().token);
        e.target.disabled = true;
        gamecontroller.playRound(row, column);
        adjustTurnDisplay();
    }

    const resetDisplay = () => {
        buttons.forEach(button => {
            let buttonClass = button.classList.contains('X') ? 'X' : 'O';
            button.classList.remove(buttonClass);
            button.disabled = false;
        })
    }

    const toggleModal = () => {
        modal.style.display = getComputedStyle(modal).display == 'none' ? 'grid' : 'none';
    }

    const addPoints = () => {
        pointsX.textContent = player1.getPoints();
        pointsO.textContent = player2.getPoints();
    }

    const adjustMessage = (winner) => {
        let token = winner.token;
        message.textContent = `${token} WON THE ROUND`;
    }

    const adjustTurnDisplay = () => {
        turnDisplay.textContent = `${gamecontroller.getActivePlayer().token} TURN`;
    }

    buttons.forEach(button => button.addEventListener('click', _buttonClicked));
    restartButton.addEventListener('click', () => {
        pointsX.textContent = '0';
        pointsO.textContent = '0';
        gamecontroller.resetAll();
    });

    nextRoundButton.addEventListener('click', () => {
        resetDisplay();
        toggleModal();
    });

    undo.addEventListener('click', () => {
        displaycontroller.resetDisplay();
        gameboard.resetBoard()
    });
      
    return {
        resetDisplay,
        toggleModal,
        addPoints,
        adjustMessage,
    }
})();