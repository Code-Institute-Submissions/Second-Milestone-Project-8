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
let timeLeft = 0;
let timeResult;
let currentRecord = localStorage.getItem("timeRecord");
let newRecord = false;

/* INDEX ----------------------------------------  */
$('.game-instructions-text').hide();
$('.game-instructions-text.easy').show();

// Level Selection and instructions - button and text

/* This function checks which difficulty level has been selected and displays its correct instruction text. */
$('.mode').click(function () {
    const modeSeconds = {
        "easy": 9,
        "normal": 6,
        "hard": 4
    };
    const mode = $(this).data("mode");
    localStorage.setItem("levelSelectionSeconds", modeSeconds[mode]);   
    $('.game-instructions-text').hide();
    $('.game-instructions-text').filter('.' + mode).show();
    $('.mode.active').removeClass('active');  // remove bootstrap btn active decoration from Easy mode after select another level mode
})


// function to check if the player has selected any difficulty level, if not,  Easy mode is default.
$('#play-game-button').click(function () {
    if (localStorage.getItem("levelSelectionSeconds") === null) {
        localStorage.setItem("levelSelectionSeconds", 9);
        return;
    }
})

//hide top-game-box div while memorize is show
$('#top-game-box').hide();
//hide top-results-box div while memorize/game is show
$('#result-page-wrap').hide();


//MEMORIZE CARDS - ALL CARDS OPENED
// When invoked all cards are show and the board is locked to avoid any user click
function memorizeShowCards() {
    lockBoard = true;
    $(cards).addClass('flip');
    return;
};

// When memorize time is over all the cards are hide again and board click is unlocked
function memorizeHideCards() {
    lockBoard = false;
    $(cards).removeClass('flip');
    return;
};

/*MEMORIZE COUNTER = EASY - 8 Seconds / NORMAL - 5 SECONDS / HARD - 3 SECONDS COUNTDOWN
This function check the difficult level selection value in seconds and create a countdown for the player memorize the card */
(function memorizeCounter() {
    let i = localStorage.getItem("levelSelectionSeconds");
    setInterval(function () {
        i--;
        if (i >= 0) {
            $('#memorize-countdown').html(i);
            memorizeShowCards(); // Show game cards before counter start
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

//GAME COUNTER -  Easy Mode = 45 sec , Normal Mode = 30 sec, Hard mode = 20 sec

function gameCounter() {
    const dataCheck = localStorage.getItem("levelSelectionSeconds")
    let i;
    let gameTime;

    if (dataCheck === "9") {
        $("#game-countdown").html("45");
        i = 45;
        gameTime = 45;
    }
    if (dataCheck === "6") {
        $("#game-countdown").html("30");
        i = 30;
        gameTime = 30;
    }
    if (dataCheck === "4") {
        $("#game-countdown").html("20");
        i = 20;
        gameTime = 20;
    };

    const gCounter = setInterval(function () {
        i--;

        if (i >= 0) {
            $('#game-countdown').html(i);
        }
        if (matchCounter === 6) { // If all 12 cards match - Stop countdown
            timeLeft = i;
            timeResult = gameTime - timeLeft // Time result is initial time minus the time left
            lockBoard = true;
            checkRecord();
            clearInterval(gCounter); // stop the game time countdown
            setTimeout(showResultsPage, 2000); // 2 seconds delay before show the game results page
        }
        if (i === 0) { // If the game finish when time is out
            timeLeft = i;
            lockBoard = true;
            setTimeout(showResultsPage, 2000); // 2 seconds delay before show the game results page
        }
    }, 1000);
};

// This function Checks if is there any record recorded, if not, a new record will be record
function checkRecord() {
    if (!currentRecord || timeResult < currentRecord) {
        localStorage.setItem("timeRecord", timeResult); // If is a newRecord, localstorage will be updated 
        newRecord = true;
    }
}

/* After the game is over the results page will be displayed. 
First it checks if game was lost, it's true, game over page is displayed
If Game won, Game win page is displayed */

function showResultsPage() {
    $('#top-game-box').hide(); // hide game top div
    $('#game-board').hide(); // hide game board div 
    $('#result-page-wrap').show() // show result page div

    if (timeLeft === 0) { //GAME LOST 
        $('#result-message').html('YOUR TIME IS UP!!!'); // show TIME IS UP message
        $('#result-emoticon').removeClass('fa-smile').addClass('fa-frown'); // show frown emoticon
        $('#game-win-box').hide() // hide result time box div
        $('#result-attempts').hide() // hide result attempts box div

    } else { // GAME WIN
        if (newRecord === true) { //Check for a new record
            $('#result-message').html('NEW RECORD!!!'); // show NEW RECORD message
            $('#result-time-box').html(timeResult);
            $('#result-attempts').html(attemptsCounter);
        } else {
            $('#result-message').html('WELL DONE!!!'); // show WELL DONE message
            $('#result-time-box').html(timeResult);
            $('#result-attempts').html(attemptsCounter);
        }
    }
}

// Flip Card

function flipCard() {
    if (lockBoard === true)
        return;
    if (this === firstCard)
        return;

    $(this).addClass('flip');

    if (!flippedCard) {
        flippedCard = true;
        firstCard = this;
        return;
    }

    secondCard = this; // second click

    // // Every 2 cards flipped, counter increases +1
    attemptsCounter++;
    attempts();

    checkForMatch(); // After 2 cards flipped, invoke the checkForMatch function
}

// Attempts - Update counter 
function attempts() {
    $('#attempts-counter').html(attemptsCounter);
}

// Card Match
function checkForMatch() {
    let cardMatch = firstCard.dataset.name === secondCard.dataset.name; // if dataset-name of first card flipped is equal to second card 
    if (cardMatch === true) {
        disableCards(); // invoke function to disable matched cards
        matchCounter++; // Each Match add matchCounter +1 -- needed for finish game when all cards are matched
    } else {
        unflipCards(); // if not match, invoke function to unflip cards
    }
}

function disableCards() { // after a card match this function is invoked to disable that cards
    firstCard.removeEventListener('click', flipCard); //remove the event click from first flipcard
    secondCard.removeEventListener('click', flipCard); //remove the event click from second flipcard
    resetBoard();
}

function unflipCards() { // this function unflip the cards
    lockBoard = true;

    setTimeout(() => {
        $(firstCard).removeClass('flip'); // remove class flip from first card
        $(secondCard).removeClass('flip'); // remove class flip from second card

        resetBoard(); // invoke reset board function
    }, 1000);
}

function resetBoard() {
    [flippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
}

(function shuffle() { // This function select each card on the board and shuffle to another position
    cards.forEach(card => {
        let cardPosition = Math.floor(Math.random() * 12);
        card.style.order = cardPosition;
    });
})();

cards.forEach(card => card.addEventListener('click', flipCard));