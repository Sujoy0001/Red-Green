// script.js

let gameActive = false;
let greenCount = 0;
let betAmount = 0;
let walletBalance = 1000;  // Start with $1000 in the wallet
let playerName = '';
let playerEmail = '';

// Function to show welcome popup and collect player information
function showWelcomePopup() {
    const welcomeModal = document.getElementById('welcomeModal');
    welcomeModal.style.display = 'flex';
}

function submitWelcomeForm() {
    const name = document.getElementById('nameInput').value;
    const email = document.getElementById('emailInput').value;

    // Validate email format
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!name || !email || !emailPattern.test(email)) {
        showModal("Please enter a valid name and email.");
        return;
    }

    playerName = name;
    playerEmail = email;

    updateWalletDisplay();
    showModal("Add 1000$ in your wallet");
    closeWelcomeModal();
}

// Update wallet balance display
function updateWalletDisplay() {
    document.getElementById('walletInfo').textContent = `${playerName}: $${walletBalance}`;
}

function setBetAmount(amount) {
    if (amount > walletBalance) {
        showModal(`You don't have enough money to bet $${amount}.`);
        return;
    }

    betAmount = amount;
    showModal(`You have selected a bet of $${amount}. Click Start Game to begin.`);
    
    document.querySelectorAll('.bet-button').forEach(btn => btn.classList.remove('active'));
    document.querySelector(`#bet${amount}`).classList.add('active');
    
    document.getElementById('startButton').disabled = false;
}

function startGame() {
    if (betAmount === 0) {
        showModal("Please select a bet amount first.");
        return;
    }

    // Deduct the bet amount from the wallet
    updateWalletBalance(-betAmount);

    gameActive = true;
    greenCount = 0;
    showModal("Game started! Click the boxes.");

    const boxes = document.querySelectorAll('.box');
    boxes.forEach(box => {
        // Reset box state for new game
        box.style.backgroundColor = '#ddd';
        box.classList.remove('green', 'red', 'disabled');
        box.onclick = () => flipBox(box);
    });

    document.getElementById('endButton').disabled = false;
    document.querySelectorAll('.bet-button').forEach(btn => btn.disabled = true);
}

function flipBox(box) {
    if (!gameActive) return;

    const isGreen = Math.random() < 0.7;
    box.style.backgroundColor = isGreen ? 'green' : 'red';
    box.onclick = null;

    if (isGreen) {
        greenCount++;
        box.classList.add('green');  // Add class for money image
    } else {
        gameActive = false;
        box.classList.add('red');  // Add class for red box

        disableAllBoxes();
        showModal("You clicked a red box! You lose.");
        
        // Prepare game for the next bet
        setTimeout(() => {
            resetGame();
        }, 2000);
        return;
    }
}

function endGame() {
    if (!gameActive) return;

    // Calculate winnings: betAmount * 0.1 * greenCount
    const winnings = betAmount * 1 * greenCount;

    if (greenCount > 0) {
        showModal(`Congratulations! You win $${winnings}!`);
        updateWalletBalance(winnings);
    } else {
        showModal("You didn't click any green boxes. You lose.");
    }

    gameActive = false;
    disableAllBoxes();
    resetGame();
}

function disableAllBoxes() {
    const boxes = document.querySelectorAll('.box');
    boxes.forEach(box => {
        box.onclick = null;
        box.classList.add('disabled');
    });

    document.getElementById('endButton').disabled = true;
}

function resetGame() {
    // Reset game state for a new round
    gameActive = false;
    greenCount = 0;
    betAmount = 0;

    document.querySelectorAll('.box').forEach(box => {
        box.style.backgroundColor = '#ddd';
        box.classList.remove('green', 'red');  // Reset classes for new game
    });

    // Check if wallet balance is depleted
    if (walletBalance <= 0) {
        showModal("You have no money to play. Please refresh the page to restart.");
        document.querySelectorAll('.bet-button').forEach(btn => btn.disabled = true);
    } else {
        enableBettingOptions();
    }
}

function enableBettingOptions() {
    document.querySelectorAll('.bet-button').forEach(btn => btn.disabled = false);
    document.getElementById('startButton').disabled = true;
}

function updateWalletBalance(amount) {
    walletBalance += amount;
    updateWalletDisplay();
}

// Modal handling functions
function showModal(message) {
    const modal = document.getElementById('modal');
    const modalMessage = document.getElementById('modalMessage');
    modalMessage.textContent = message;
    modal.style.display = 'flex';
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

function closeWelcomeModal() {
    const welcomeModal = document.getElementById('welcomeModal');
    welcomeModal.style.display = 'none';
}

// Show welcome popup on page load
window.onload = showWelcomePopup;
