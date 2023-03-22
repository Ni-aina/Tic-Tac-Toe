var origBoard;
const huPlayer = "O";
const aiPlayer = "X";
const winCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
]

const cells = document.querySelectorAll('.cell');
startGame();

function startGame() {
    document.querySelector(".endgame").style.display = "none";
    origBoard = Array.from(Array(9).keys());
    for (let i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

function turnClick(square) {
    if (typeof origBoard[square.target.id] == "number") {
        turn(square.target.id, huPlayer);
        if (!checkTie() && !checkWin(origBoard, huPlayer)) turn(bestSpot(), aiPlayer);
    }
}

function turn(squareId, player) {
    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(origBoard, player);
    if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) => 
        (e === player)? a.concat(i) : a, []);
    let gameWon = null;
    for (const [index, win] of winCombos.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {index: index, player: player};
            break;
        }
    }   
    return gameWon;
}

function gameOver(gameWon) {
    for (const index of winCombos[gameWon.index]) {
        document.getElementById(index).style.backgroundColor = 
            gameWon.player == huPlayer ? "blue" : "red";
    }   
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(gameWon.player == huPlayer ? "You win." : "You lose.");
}

function declareWinner(who) {
    document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame .text").innerText = who;
}

function emptySquare(newBoard) {
    return newBoard.filter(s => typeof s === "number");
}

function bestSpot() {
    return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
    if (emptySquare(origBoard).length == 0) {
        for (let i = 0; i < cells.length; i++) {
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click', turnClick, false);
        }
        declareWinner("Tie Game!");
        return true;
    }
    return false;
}

function minimax(newBoard, player) {
    var availSpots = emptySquare(newBoard);
    if (checkWin(newBoard, huPlayer)) {
        return {eval: -10};
    } 
    else if (checkWin(newBoard, aiPlayer)) {
        return {eval: 10};
    } 
    else if (availSpots.length === 0) {
        return {eval : 0};
    }
    let bestMove = {};
    if (player === aiPlayer) {
        let maxEval = -Infinity;
        bestMove.eval = -Infinity;
        getSucc(newBoard, player).map(child => {
            maxEval = Math.max(maxEval, minimax(child.succ, huPlayer).eval);
            if (bestMove.eval < maxEval) {
                bestMove.index = child.index;
            }
            bestMove.eval = maxEval;
        });
    } 
    else  {
        let minEval = Infinity;
        bestMove.eval = Infinity;
        getSucc(newBoard, player).map(child => {
            minEval = Math.min(minEval, minimax(child.succ, aiPlayer).eval);
            if (bestMove.eval > minEval) {
                bestMove.index = child.index;
            }
            bestMove.eval = minEval;
        });
    }
    return bestMove;
}

function getSucc(newBoard, player) {
    let moves = [];
    for (let i = 0; i < origBoard.length; i++) {
        if (typeof newBoard[i] === "number") {
            let move = {};
            let succ = newBoard.slice();
            succ[i] = player;
            move.index = i;
            move.succ = succ;
            moves.push(move);
        }
    }
    return moves;
}