// ---------  Variables ---------- //
let levelSelectionSeconds;
let countdownMemorize;
const cards = document.querySelectorAll('.cards');
let attemptsCounter = 0;
let flippedCard = false;
let lockBoard = false;
let firstCard, secondCard;
let gameInstructions;
let matchCounter = 0;
let gCounter;
let timeLeft = 0;

// INDEX ----------------------------------------

// Level Selection and instructions - button and text
function changeGameInstructions() {
    if (gameInstructions === 'easy') {
        $('#game-instructions-text').html("1. In EASY MODE you will have 8 seconds to memorize the deck cards.<br>2. After 8 seconds all cards will be dealt face down and the game will begin.<br>3. You will have 30 seconds to find all pairs. Each attempt, right or wrong, will be counted and will set your final score.<br>4. The game ends after the player matches all pairs or the time is up.");
    }
    if (gameInstructions === 'normal') {
        $('#easy-mode-button').removeClass("active"); // By default EASY MODE is selected, after click in another mode, the active class from easy-mode is removed
        $('#game-instructions-text').html("1. In NORMAL MODE you will have 5 seconds to memorize the deck cards.<br>2. After 5 seconds all cards will be dealt face down and the game will begin.<br>3. You will have 30 seconds to find all pairs. Each attempt, right or wrong, will be counted and will set your final score.<br>4. The game ends after the player matches all pairs or the time is up.");
    }
    if (gameInstructions === 'hard') {
        $('#easy-mode-button').removeClass("active"); // By default EASY MODE is selected, after click in another mode, the active class from easy-mode is removed
        $('#game-instructions-text').html("1. In HARD MODE you will have 3 seconds to memorize the deck cards.<br>2. After 3 seconds all cards will be dealt face down and the game will begin.<br>3. You will have 30 seconds to find all pairs. Each attempt, right or wrong, will be counted and will set your final score.<br>4. The game ends after the player matches all pairs or the time is up.");
    }
}

$('#easy-mode-button').click(function () {
    gameInstructions = 'easy'
    changeGameInstructions();
});

$('#normal-mode-button').click(function () {
    gameInstructions = 'normal'
    changeGameInstructions();
});

$('#hard-mode-button').click(function () {
    gameInstructions = 'hard'
    changeGameInstructions();
});

// Level Selection countdown Time in seconds to local storage //
$('#easy-mode-button').click(function () {
    localStorage.setItem("levelSelectionSeconds", 9); // 9 - 1 counter 8 secondas
});
$('#normal-mode-button').click(function () {
    localStorage.setItem("levelSelectionSeconds", 6); // 6 - 1 counter 5 seconds
});
$('#hard-mode-button').click(function () {
    localStorage.setItem("levelSelectionSeconds", 4); // 4 - 1 counter 3 seconds
});
//-------------------------------------------------------

//hide top-game-box div while memorize is show
$('#top-game-box').hide();
//hide top-results-box div while memorize/game is show
$('#results-header').hide();

//MEMORIZE CARDS - ALL CARDS OPENED
function memorizeCards() {
    lockBoard = true;
    $(cards).addClass('flip');
    return;
};

function memorizeHideCards() {
    lockBoard = false;
    $(cards).removeClass('flip');
    return;
};

//MEMORIZE COUNTER = EASY - 8 Seconds / NORMAL - 5 SECONDS / HARD - 3 SECONDS COUNTDOWN
(function memorizeCounter() {
    let i = localStorage.getItem("levelSelectionSeconds");
    setInterval(function () {
        i--;
        if (i >= 0) {
            $('#memorize-countdown').html(i);
            memorizeCards(); // Show game cards before counter start
        }
        if (i === 0) {
            clearInterval(i);
            $('#top-memorize-box').hide(); // Div top-memorize-box hide after counter
            $('#top-game-box').show(); // Div top-game-box show after memorize countdown
            $('#memorize').hide(); // Div Memorize hide after counter
            memorizeHideCards(); // Hide game cards after memorize counter
            gameCounter();
        }
    }, 1000);

})();

//GAME COUNTER -  30 SECONDS COUNTDOWN
function gameCounter() {
    let i = 30; //
    gCounter = setInterval(function () {
        i--;

        if (i >= 0) {
            $('#game-countdown').html(i);
        }
        if (matchCounter === 6) { // If all 12 cards match - Stop countdown
            gameWin();
            timeLeft = i;
        }
        if (i === 0) {
            clearInterval(i);
            GameOverDelay();
        }

    }, 1000);
};

function gameWin() {
    clearInterval(gCounter); // stop the game time countdown
    
    GameOverDelay(); // 3 seconds delay to show the game results page
};

function GameOverDelay() {
    let i = 3;
    setInterval(function () {
        i--;
        if (i === 0) {
            $('#top-game-box').hide();  // hide game top div
            $('#game-board').hide();    // hide game board
            showResultsPage();
        }
    }, 1000);
};

function showResultsPage() {
    window.location = "result.html";
}

// Flip Card

function flipCard() {
    if (lockBoard)
        return;
    if (this === firstCard)
        return;

    $(this).addClass('flip');

    if (!flippedCard) { //first click
        flippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this; // second click

    // // Every 2 cards flipped, counter increases +1
    attemptsCounter++;
    attempts();

    checkForMatch();
}

// Attempts - Update counter 
function attempts() {
    $('#attempts-counter').html(attemptsCounter);
}

// Card Match
function checkForMatch() {
    let cardMatch = firstCard.dataset.name === secondCard.dataset.name;

    if (cardMatch === true) {
        disableCards();
        matchCounter++; // Each Match add matchCounter +1 -- needed for finish game when all cards are matched
    } else {
        unflipCards();
    }
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);

    resetBoard();
}

function unflipCards() {
    lockBoard = true;

    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');

        resetBoard();
    }, 1000);
}

function resetBoard() {
    [flippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

(function shuffle() {
    cards.forEach(card => {
        let cardPosition = Math.floor(Math.random() * 12);
        card.style.order = cardPosition;
    });
})();

cards.forEach(card => card.addEventListener('click', flipCard));