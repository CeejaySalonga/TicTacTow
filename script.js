const rows = 5;
const cols = 6;
let currentPlayer = 'X';
let board = createBoard();
let scores = { 'X': 0, 'O': 0 };
const winningScore = 5;
let draws = 0;
let aiLevel = ''; // To store the selected AI level
let isAITurn = false;

// Manually define winning combinations
const winningCombos = [
// Rows
[[0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5]],
[[1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5]],
[[2, 0], [2, 1], [2, 2], [2, 3], [2, 4], [2, 5]],
[[3, 0], [3, 1], [3, 2], [3, 3], [3, 4], [3, 5]],
[[4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5]],
// Columns
[[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]],
[[0, 1], [1, 1], [2, 1], [3, 1], [4, 1]],
[[0, 2], [1, 2], [2, 2], [3, 2], [4, 2]],
[[0, 3], [1, 3], [2, 3], [3, 3], [4, 3]],
[[0, 4], [1, 4], [2, 4], [3, 4], [4, 4]],
[[0, 5], [1, 5], [2, 5], [3, 5], [4, 5]],
// Diagonals
[[0, 1],[1, 0]],
[[0, 2],[1, 1],[2, 0]],
[[0, 3],[1, 2],[2, 1],[3, 0]],
[[0, 4],[1, 3],[2, 2],[3, 1],[4, 0]],
[[0, 5],[1, 4],[2, 3],[3, 2],[4, 1]],
[[1, 5],[2, 4],[3, 3],[4, 2]],
[[2, 5],[3, 4],[4, 3],],
[[3, 5],[4, 4]],
[[3, 0],[4, 1]],
[[2, 0],[3, 1],[4, 2]],
[[1, 0],[2, 1],[3, 2],[4, 3]],
[[0, 0],[1, 1],[2, 2],[3, 3],[4, 4]],
[[0, 1],[1, 2],[2,3],[3, 4],[4, 5]],
[[0, 2],[1, 3],[2, 4],[3, 5]],
[[0, 3],[1, 4],[2, 5]],
[[0, 4],[1, 5]]
];

function createBoard() {
const board = [];
for (let i = 0; i < rows; i++) {
const row = [];
for (let j = 0; j < cols; j++) {
    row.push('');
}
board.push(row);
}
return board;
}

function render() {
const table = document.getElementById('ticTacToe');
table.innerHTML = '';

const winningCombo = getWinningCombo(); // New line to get the winning combination

for (let i = 0; i < rows; i++) {
const row = document.createElement('tr');
for (let j = 0; j < cols; j++) {
    const cell = document.createElement('td');
    cell.textContent = board[i][j];

    // Check if the cell is part of the winning combination
    if (winningCombo && winningCombo.some(([rowIndex, colIndex]) => rowIndex === i && colIndex === j)) {
        cell.classList.add('winning-cell'); // Add the winning-cell class
    }

    cell.addEventListener('click', () => cellClick(i, j));
    row.appendChild(cell);
}
table.appendChild(row);
}
}

function updateScores() {
document.getElementById('scoreX').textContent = scores['X'];
document.getElementById('scoreO').textContent = scores['O'];
document.getElementById('drawsCount').textContent = draws;
}


function resetGame() {
board = createBoard();
currentPlayer = 'X'; // Set currentPlayer back to 'X'
draws = 0; // Reset the draws counter
render();
updateTurnLabel();
}


function updateTurnLabel() {
document.getElementById('turnLabel').textContent = `Turn: Player ${currentPlayer}`;
}

function setInitialPlayerToX() {
currentPlayer = 'X';
}

function initializeGame() {
scores = { 'X': 0, 'O': 0 };
setInitialPlayerToX();
updateTurnLabel();
updateScores();
}

function startGame(mode) {
let gameMode = mode;

if (gameMode === "1") {
initializeGame();
} else if (gameMode === "2") {
const aiDifficulty = localStorage.getItem('difficulty');

if (aiDifficulty === "1") {
    aiLevel = 'easy';
} else if (aiDifficulty === "2") {
    aiLevel = 'difficult';
} else if (aiDifficulty === "3") {
    aiLevel = 'expert';
} else {
    alert("Invalid selection. Defaulting to Player VS Player.");
    initializeGame();
    return;
}

initializeGame();
playAgainstAI();
} else {
alert("Invalid selection. Defaulting to Player VS Player.");
initializeGame();
}
}

function evaluate() {
for (const combo of winningCombos) {
const values = combo.map(([i, j]) => board[i][j]);
if (values.every(value => value === 'O')) {
    return 10;
} else if (values.every(value => value === 'X')) {
    return -10;
}
}
return 0;
}

function minimax(board, depth, alpha, beta, isMaximizing) {
const scores = {
X: -1,
O: 1,
tie: 0
};

const score = evaluate();

if (score !== 0) {
return score;
}

if (depth >= 2) { // Adjusted the depth to 2
return 0;
}

if (isMaximizing) {
let bestScore = -Infinity;
for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        if (board[i][j] === '') {
            board[i][j] = 'O';
            bestScore = Math.max(bestScore, minimax(board, depth + 1, alpha, beta, false));
            board[i][j] = '';
            
            alpha = Math.max(alpha, bestScore);
            if (beta <= alpha) {
                break; // Beta cut-off
            }
        }
    }
}
return bestScore;
} else {
let bestScore = Infinity;
for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
        if (board[i][j] === '') {
            board[i][j] = 'X';
            bestScore = Math.min(bestScore, minimax(board, depth + 1, alpha, beta, true));
            board[i][j] = '';

            beta = Math.min(beta, bestScore);
            if (beta <= alpha) {
                break; // Alpha cut-off
            }
        }
    }
}
return bestScore;
}
}

function findBestMove() {
let bestScore = -Infinity;
let bestMove;

for (let i = 0; i < rows; i++) {
for (let j = 0; j < cols; j++) {
    if (board[i][j] === '') {
        board[i][j] = 'O';
        const score = minimax(board, 0, false);
        board[i][j] = '';

        if (score > bestScore) {
            bestScore = score;
            bestMove = { row: i, col: j };
        }
    }
}
}

return bestMove;
}

function playAgainstAI() {
if (currentPlayer === 'O') {
// Set isAITurn to true before AI's turn
isAITurn = true;

if (aiLevel === 'expert') {
    setTimeout(() => {
        const bestMove = findBestMove();
        cellClick(bestMove.row, bestMove.col);
    }, 1); // A small delay, e.g., 10 milliseconds
} else if (aiLevel === 'difficult') {
    setTimeout(() => {
        if (Math.random() < 0.5) {
            const bestMove = findBestMove();
            cellClick(bestMove.row, bestMove.col);
        } else {
            makeRandomMove();
        }
    }, 1); // A small delay, e.g., 10 milliseconds
} else {
    setTimeout(() => {
        makeRandomMove();
    }, 10); // A small delay, e.g., 10 milliseconds
}

// Set isAITurn back to false after AI move
isAITurn = false;
}
}

function checkDraw() {
for (let i = 0; i < rows; i++) {
for (let j = 0; j < cols; j++) {
    if (board[i][j] === '') {
        return false; // There is an empty cell, game is not a draw
    }
}
}
draws++;
return true; // All cells are filled, indicating a draw
}

// Helper function to make a completely random move
function makeRandomMove() {
const emptyCells = [];
for (let i = 0; i < rows; i++) {
for (let j = 0; j < cols; j++) {
    if (board[i][j] === '') {
        emptyCells.push({ row: i, col: j });
    }
}
}

if (emptyCells.length > 0) {
const randomIndex = Math.floor(Math.random() * emptyCells.length);
const { row, col } = emptyCells[randomIndex];
cellClick(row, col);
}
}

// Replace alert with custom pop-up function
function showPopup(message, callback) {
    const popupContainer = document.getElementById('popupContainer');
    popupContainer.innerHTML = `
        <div class="popup">
            <div class="popup-content">
                <p>${message}</p>
                <button onclick="closePopup(${callback})">NEXT</button>
            </div>
        </div>
    `;
}

function closePopup(callback) {
    const popupContainer = document.getElementById('popupContainer');
    popupContainer.innerHTML = ''; // Clear the pop-up container

    // Execute callback function if provided
    if (callback && typeof callback === 'function') {
        callback();
    }
}

function cellClick(row, col) {
    // Check if it's the AI's turn, and return early if true
    if (isAITurn) {
        return;
    }

    if (board[row][col] === '' && !checkWinner()) {
        board[row][col] = currentPlayer;
        render();

        // Check for a winner after rendering
        if (checkWinner()) {
            scores[currentPlayer]++;
            updateScores();

            const winningCombo = getWinningCombo();

            if (scores[currentPlayer] === winningScore) {
                setTimeout(() => {
                    showPopup(`Player ${currentPlayer} wins the game!`, function () {
                        scores = { 'X': 0, 'O': 0 };
                        updateScores();
                        resetGame();
                    });
                }, 150); // Adjust the delay as needed
            } else {
                setTimeout(() => {
                    showPopup(`Player ${currentPlayer} wins this round!`, resetGame);
                }, 150);
            }

            // Highlight the winning cells after the pop-up
            highlightWinningCells(winningCombo);

            // Set isAITurn back to false after the pop-up
            isAITurn = false;
        } else if (checkDraw()) {
            setTimeout(() => {
                showPopup("It's a draw!", function () {
                    updateScores();
                    resetGame();
                });
            }, 150);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateTurnLabel();

            if (aiLevel !== '' && currentPlayer === 'O') {
                // Set isAITurn to true before AI's turn
                isAITurn = true;

                setTimeout(() => {
                    playAgainstAI();
                }, 0);
            }
        }
    }
}



function highlightWinningCells(winningCombo) {
    if (winningCombo) {
        for (const [i, j] of winningCombo) {
            const cell = document.querySelector(`#ticTacToe tr:nth-child(${i + 1}) td:nth-child(${j + 1})`);
            cell.classList.add('winning-cell');
        }
    }
}

function getWinningCombo() {
for (const combo of winningCombos) {
const values = combo.map(([i, j]) => board[i][j]);
if (values.every(value => value === currentPlayer)) {
    return combo;
}
}
return null;
}


function checkWinner() {
for (const combo of winningCombos) {
const values = combo.map(([i, j]) => board[i][j]);
if (values.every(value => value === currentPlayer)) {
    return true;
}
}
return false;
}




initializeGame(); // Initialize the game when the page loads
render();
