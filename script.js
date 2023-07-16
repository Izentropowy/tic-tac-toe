
const gameboard = (() => {
    const dimension = 3;

    const createEmptyBoard = () => {
        let newBoard = [];

        for (let i = 0; i < dimension; i++) {
            newBoard[i] = [];
            for (let j = 0; j < dimension; j++) {
                newBoard[i].push("");
            }   
        }

        return newBoard;
    }

    const board = createEmptyBoard();

    const getBoard = () => board;

    const updateBoard = (oldBoard, move) => {
        // logic
        board = updatedBoard;
        return board;
    }

    return {
        getBoard,
        updateBoard,
    };
})();

console.log(gameboard.getBoard());