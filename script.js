
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
    const tiePlayer = player('player2', 't');

    let activePlayer = player1;
    let roundCounter = 0;
    const board = gameboard.getBoard();

    const toggleActivePlayer = () => {
        activePlayer === player1 ? activePlayer = player2 : activePlayer = player1;
    }

    const getActivePlayer = () => activePlayer;

    const _findWinner = () => {
        const winningLines = [];
        let winner = false;
        const checkLine = (line, coordinates) => {
            if (line === "XXX") {
                winner = player1;
                displaycontroller.colorWinningLine(coordinates);
            }
            else if (line === "OOO") {
                winner = player2;
                displaycontroller.colorWinningLine(coordinates);
            }
            else if (roundCounter === 9 && (!winner)) {
                winner = tiePlayer;
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
            let coordinates = [];
            line.forEach((coordinate) => {
                // each element contains coordinates [x, y] - row and column of a button
                checked += board[coordinate[0]][coordinate[1]].getValue();
                coordinates.push(coordinate);
            });
            checkLine(checked, coordinates);
            checked = "";
            coordinates = [];
        });

        return winner;
    }

    const resetAll = () => {
            displaycontroller.resetDisplay();
            gameboard.resetBoard();
            roundCounter = 0;
    }

    const playRound = (row, column) => {
        roundCounter += 1;
        console.log(roundCounter);
        gameboard.updateBoard(row, column, activePlayer);
        toggleActivePlayer();
        let winner = _findWinner()
        if (winner) {
            winner.addPoint();
            displaycontroller.adjustMessage(winner);
            displaycontroller.addPoints();
            setTimeout(() => {
                resetAll();
                displaycontroller.toggleModal();
              }, 500);

            if (winner.token === 'X' || winner.token === 't') {
                toggleActivePlayer();
            }
        }
    }

    return {
        player1,
        player2,
        tiePlayer,
        getActivePlayer,
        playRound,
        resetAll,
        toggleActivePlayer,
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
    const ties = document.querySelector('.ties');
    const message = document.querySelector('.message');
    const player1 = gamecontroller.player1;
    const player2 = gamecontroller.player2;
    const tiePlayer = gamecontroller.tiePlayer;

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
        ties.textContent = tiePlayer.getPoints();
    }

    const adjustMessage = (winner) => {
        let token = winner.token;
        if (winner.token === 't') {
            message.textContent = `IT'S A TIE`;
        }
        else {
            message.textContent = `${token} WON THE ROUND`;
        };
    }

    const adjustTurnDisplay = () => {
        turnDisplay.textContent = `${gamecontroller.getActivePlayer().token} TURN`;
    }

    const colorWinningLine = (coordinates) => {
        coordinates.forEach(coordinate => {
            let row = coordinate[0];
            let column = coordinate[1];
            const button = document.querySelector(`[data-row="${row}"][data-column="${column}"]`);
            button.classList.add('winner');
            setTimeout(() => {
                button.classList.remove('winner');
              }, 500);
        });
        

    }

    buttons.forEach(button => button.addEventListener('click', _buttonClicked));
    restartButton.addEventListener('click', () => {
        pointsX.textContent = '0';
        pointsO.textContent = '0';
        ties.textContent = '0';
        gamecontroller.resetAll();
        toggleModal();
    });

    nextRoundButton.addEventListener('click', () => {
        toggleModal();
    });

    undo.addEventListener('click', () => {
        gamecontroller.resetAll();
        if (gamecontroller.getActivePlayer().token === 'O') {
            gamecontroller.toggleActivePlayer();
        }
        adjustTurnDisplay();
    });
      
    return {
        resetDisplay,
        toggleModal,
        addPoints,
        adjustMessage,
        colorWinningLine,
    }
})();