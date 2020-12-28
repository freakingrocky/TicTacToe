var initialState;
const huPlayer = "X";
const AIPlayer = "O";
const winCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
    [1, 4, 7], [2, 5, 8], [0, 4, 8], [6, 4, 2]
];

const cells = document.querySelectorAll('.cell')
startGame();

function reset() {
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].addEventListener('click', turnClick, false);
        cells[i].style.backgroundColor = "#b17304"
    }
}

function startGame() {
    document.querySelector('.endGame').style.display = "none";
    initialState = Array.from(Array(9).keys());
    reset();
}

function turnClick(square) {
    turn(square.target.id, huPlayer)
}

function terminal(board, player) {
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    let terminalState = null;
    for (let [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            terminalState = { index: index, player: player };
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
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
}

function turn(squareId, player) {
    initialState[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let terminalState = terminal(initialState, player)
    if (terminalState) gameOver(terminalState)
}


