let Board;
const huPlayer = "X";
const AIPlayer = "O";
const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
    [1, 4, 7], [2, 5, 8], [0, 4, 8], [6, 4, 2]
];

const cells = document.querySelectorAll('.cell')
startGame();

function reset() {
    document.querySelector(".status").innerText = "The Unbeatable Tic-Tac-Toe AI";
    document.querySelector(".status").animation = "";
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].addEventListener('click', turnClick, false);
        cells[i].style.backgroundColor = "#b17304"
    }
}

function startGame() {
    Board = Array.from(Array(9).keys());
    reset();
}

function emptySquares() {
    return Board.filter((elm, i) => i===elm)
}

function popUpWinner(str) {
    document.querySelector(".status").innerText = str;
    document.querySelector(".status").animation = "glowAlt 1s ease -in -out infinite alternate";

}

function checkTie(available) {
    if (available.length == 0) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "#99127a";
            cells[i].removeEventListener('click', turnClick, false);
        }
        popUpWinner("That's a tie!");
        return true;
    }
    return false;
}

function turnClick(square) {
    if (typeof Board[square.target.id] == 'number') {
        turn(square.target.id, huPlayer)
        if (!checkTie(emptySquares()) && !terminal(Board, huPlayer))
            turn(minimax(), AIPlayer);
    }
}

function terminal(board, player) {
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    let terminalState = null;
    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            terminalState = {index: index, player: player};
            break;
        }
    }
    return terminalState;
}

function gameOver(terminalState) {
    for (let index of winCombos[terminalState.index]) {
        document.getElementById(index).style.backgroundColor =
            terminalState.player == huPlayer ? "green" : "red";
    }
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    popUpWinner(terminalState.player === huPlayer ? "It's Impossible! You're a hacker!" : "AI Wins!!!");
}

function turn(squareId, player) {
    Board[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let terminalState = terminal(Board, player);
    if (terminalState) gameOver(terminalState);
    checkTie(emptySquares());
}

// AI
function minimax() {
    return minimaxAlgorithm(Board, AIPlayer).index;
}

function minimaxAlgorithm(newBoard, player) {
    var available = emptySquares(newBoard);

    if (terminal(newBoard, huPlayer)) {
        return {score: -1};
    }
    else if (terminal(newBoard, AIPlayer)) {
        return {score: 1};
    }
    else if (available.length === 0) {
        return {score: 0};
    }

    var moves = [];
    for (let i = 0; i < available.length; i++) {
        var move = {};
        move.index = newBoard[available[i]];
        newBoard[available[i]] = player;

        if (player === AIPlayer) {
            move.score = minimaxAlgorithm(newBoard, huPlayer).score;
        } else {
            move.score = minimaxAlgorithm(newBoard, AIPlayer).score;
        }
        newBoard[available[i]] = move.index;
        if ((player === AIPlayer && move.score === 1) || (player === huPlayer && move.score === -1))
            return move;
        else
            moves.push(move);
    }
    let bestMove, bestScore;
    if (player === AIPlayer) {
        bestScore = -1000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        bestScore = 1000;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }
    return moves[bestMove];
}
