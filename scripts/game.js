const boxes = document.querySelectorAll('.box');
const statusText = document.getElementById('status');
const resetBtn = document.querySelector('.reset');
const startOverlay = document.getElementById('start-overlay');
const notificationOverlay = document.getElementById('notification-overlay');
const btnYes = document.getElementById('btn-yes');
const btnNo = document.getElementById('btn-no');

let currentPlayer = 'X';
let board = ["", "", "", "", "", "", "", "", ""];
let gameActive = false; // Game starts inactive

const winConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Start Game Flow
function initGame() {
    // Check if game was reset
    const isReset = sessionStorage.getItem('gameReset');

    if (isReset) {
        const overlayTitle = startOverlay.querySelector('h2');
        if (overlayTitle) {
            overlayTitle.textContent = "Ready to play again?";
        }
        // Clear the flag so refresh shows default message
        sessionStorage.removeItem('gameReset');
    }

    // Show Start Overlay with a slight delay to allow animation to play
    if (startOverlay) {
        document.body.classList.add('overlay-active');
        setTimeout(() => {
            startOverlay.classList.add('active');
        }, 100);
    }
}

// ... existing code ...

function resetGame() {
    // Set flag before reloading
    sessionStorage.setItem('gameReset', 'true');
    // Reload the page to reset the game completely
    window.location.reload();
}

if (btnYes) {
    btnYes.addEventListener('click', () => {
        startOverlay.classList.remove('active');

        // Show Notification
        notificationOverlay.classList.add('active');

        setTimeout(() => {
            notificationOverlay.classList.remove('active');
            document.body.classList.remove('overlay-active');
            startGame();
        }, 2000);
    });
}

if (btnNo) {
    btnNo.addEventListener('click', () => {
        // Redirect to home if user says No
        window.location.href = 'index.html';
    });
}

function startGame() {
    gameActive = true;
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
    statusText.style.color = 'var(--text-color)';
    boxes.forEach(box => {
        box.textContent = "";
        box.className = 'box'; // Reset classes
        box.disabled = false;
    });
    board = ["", "", "", "", "", "", "", "", ""];
}

function handleCellClick(e) {
    const box = e.target;
    const index = box.getAttribute('data-index');

    if (board[index] !== "" || !gameActive) return;

    updateCell(box, index);
    checkWinner();
}

function updateCell(box, index) {
    board[index] = currentPlayer;
    box.textContent = currentPlayer;
    box.classList.add(currentPlayer.toLowerCase());
    box.disabled = true; // Disable clicked box
}

function changePlayer() {
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    statusText.textContent = `Player ${currentPlayer}'s Turn`;
}

function checkWinner() {
    let roundWon = false;
    let winningLine = [];

    for (let i = 0; i < winConditions.length; i++) {
        const [a, b, c] = winConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            winningLine = [a, b, c];
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `Player ${currentPlayer} Wins! 🎉`;
        statusText.style.color = 'var(--primary-color)';
        highlightWinningCells(winningLine);
        gameActive = false;
        triggerConfetti();
        return;
    }

    if (!board.includes("")) {
        statusText.textContent = "It's a Draw!";
        statusText.style.color = 'var(--secondary-color)';
        gameActive = false;
        return;
    }

    changePlayer();
}

function highlightWinningCells(indices) {
    indices.forEach(index => {
        boxes[index].classList.add('win');
    });
}

function triggerConfetti() {
    const colors = ['#ff0055', '#00f2ff', '#ffe600', '#9900ff', '#ffffff'];

    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');

        // Random Properties
        const bg = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100 + 'vw';
        const animDuration = Math.random() * 3 + 2 + 's'; // 2-5s
        const size = Math.random() * 10 + 5 + 'px';

        confetti.style.backgroundColor = bg;
        confetti.style.left = left;
        confetti.style.width = size;
        confetti.style.height = size;
        confetti.style.animationDuration = animDuration;

        document.body.appendChild(confetti);

        // Remove after animation
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }
}

function resetGame() {
    // Set flag before reloading
    sessionStorage.setItem('gameReset', 'true');
    // Reload the page to reset the game completely
    window.location.reload();
}

boxes.forEach(box => box.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);

// Initialize
initGame();
