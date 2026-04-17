let boxes = document.querySelectorAll(".box");
let reset = document.querySelector("#reset");
let newGameBtn = document.querySelector("#new-game");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");

let board = ["", "", "", "", "", "", "", "", ""];

const HUMAN = "O";
const AI = "X";

// 👉 CHANGE THIS TO TEST
let difficulty = "hard"; // "easy" | "medium" | "hard"

const winPatterns = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [2,4,6],
    [0,4,8]
];

// RESET GAME
const resetGame = () => {
    board = ["", "", "", "", "", "", "", "", ""];
    boxes.forEach(box => {
        box.innerText = "";
        box.disabled = false;
    });
    msgContainer.classList.add("hide");
};

// PLAYER MOVE
boxes.forEach((box, index) => {
    box.addEventListener("click", () => {
        if (board[index] !== "") return;

        makeMove(index, HUMAN);

        if (!checkGameOver()) {
            setTimeout(aiMove, 300); // 300ms = 300 milliseconds = 0.3 seconds
        }
    });
});

// MAKE MOVE
const makeMove = (index, player) => {
    board[index] = player;
    boxes[index].innerText = player;
    boxes[index].disabled = true;
};

// AI MOVE CONTROLLER
const aiMove = () => {
    let move;

    if (difficulty === "easy") {
        move = getRandomMove();
    } 
    else if (difficulty === "medium") {
        // 50% smart, 50% random
        if (Math.random() < 0.5) {
            move = getRandomMove();
        } else {
            move = getBestMove();
        }
    } 
    else {
        move = getBestMove();
    }

    makeMove(move, AI);
    checkGameOver();
};

// RANDOM MOVE (EASY)
const getRandomMove = () => {
    let empty = board
        .map((val, idx) => val === "" ? idx : null)
        .filter(val => val !== null);

    return empty[Math.floor(Math.random() * empty.length)];
};

// BEST MOVE (MINIMAX)
const getBestMove = () => {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < 9; i++) {
        if (board[i] === "") {
            board[i] = AI;

            let score = minimax(board, 0, false);

            board[i] = "";

            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    return move;
};

// MINIMAX WITH DEPTH
const minimax = (board, depth, isMaximizing) => {
    let result = checkWinner();

    if (result !== null) {
        return result;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;

        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = AI;

                let score = minimax(board, depth + 1, false);

                board[i] = "";

                bestScore = Math.max(score, bestScore);
            }
        }

        return bestScore;
    } 
    else {
        let bestScore = Infinity;

        for (let i = 0; i < 9; i++) {
            if (board[i] === "") {
                board[i] = HUMAN;

                let score = minimax(board, depth + 1, true);

                board[i] = "";

                bestScore = Math.min(score, bestScore);
            }
        }

        return bestScore;
    }
};

// CHECK WINNER (LOGIC + DEPTH SCORE)
const checkWinner = () => {
    for (let pattern of winPatterns) {
        let [a,b,c] = pattern;

        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            if (board[a] === AI) return 10;
            if (board[a] === HUMAN) return -10;
        }
    }

    if (!board.includes("")) return 0;

    return null;
};

// GAME OVER UI
const checkGameOver = () => {
    let result = checkWinner();

    if (result === 10) {
        showMessage("AI Wins 🤖");
        disableBoxes();
        return true;
    } 
    else if (result === -10) {
        showMessage("You Win 🔥");
        disableBoxes();
        return true;
    } 
    else if (result === 0) {
        showMessage("It's a Draw 😐");
        return true;
    }

    return false;
};

// UI HELPERS
const disableBoxes = () => {
    boxes.forEach(box => box.disabled = true);
};

const showMessage = (text) => {
    msg.innerText = text;
    msgContainer.classList.remove("hide");
};

// BUTTONS
reset.addEventListener("click", resetGame);
newGameBtn.addEventListener("click", resetGame);
