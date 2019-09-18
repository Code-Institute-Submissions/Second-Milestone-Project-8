// ---------  Variables ---------- //
let levelSelectionSeconds;
let countdownMemorize;
const cards = document.querySelectorAll('.cards');
let attemptsCounter = 0;
let flippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

// Level Selection countdown Time in seconds to local store //
$('#easy-mode-button').click(function () {
    localStorage.setItem("levelSelectionSeconds", 8);
});
$('#normal-mode-button').click(function () {
    localStorage.setItem("levelSelectionSeconds", 5);
});
$('#hard-mode-button').click(function () {
    localStorage.setItem("levelSelectionSeconds", 3);
});

// Memorize Countdown ( 8, 5 or 3 seconds, after difficulty selection)//

//hide top-game-box div while memorize is show

$('#start-button').click(function () {
    $('#top-game-box').hide();
});


$(document).ready(
(function memorizeCounter() {
    if (window.location.pathname == 'game.html') {
        let i = localStorage.getItem("levelSelectionSeconds");
        setInterval(function () {
            i--;
            if (i >= 0) {
                console.log(i);
            }
            if (i === 0) {
                clearInterval(i);
            }
        },1000);
    }})());


// Gameboard



// Flip Card //

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!flippedCard) {
        // first click
        flippedCard = true;
        firstCard = this;

        return;
    }

    // second click
    secondCard = this;

    // // Every 2 cards flipped, counter increases +1
    attemptsCounter++;
    attempts();

    checkForMatch();
}

// Attempts - After 2 cards flipped, attempts counter increases +1

function attempts() {
    $('#attempts-counter').html(attemptsCounter);
}

// Card Match
function checkForMatch() {
    let cardMatch = firstCard.dataset.name === secondCard.dataset.name;

    if (cardMatch === true) {
        disableCards();
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
    }, 1500);
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