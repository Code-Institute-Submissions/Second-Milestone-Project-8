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
    localStorage.setItem("levelSelectionSeconds", 9); // 9 - 1 counter
});
$('#normal-mode-button').click(function () {
    localStorage.setItem("levelSelectionSeconds", 6); // 6 - 1 counter
});
$('#hard-mode-button').click(function () {
    localStorage.setItem("levelSelectionSeconds", 4); // 4 - 1 counter
});

//hide top-game-box div while memorize is show
$('#top-game-box').hide();

//MEMORIZE CARDS - ALL CARDS OPENED
function memorizeCards() {
    lockBoard = true;
    $(cards).addClass('flip');
    return;
};

function memorizeHideCards() {
    lockBoard = true;
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
            //memorizeCards();
        }
        if (i === 0) {
            clearInterval(i);
            // funcao para desvirar todas as cartas
            $('#top-memorize-box').hide();
            $('#top-game-box').show();
            $('#memorize-footer').hide();
            //memorizeHideCards();
        }
    }, 1000);
    
})();

//GAME COUNTER -  30 SECONDS COUNTDOWN
(function gameCounter() {
    let i = 36;
    setInterval(function () {
        i--;
        if (i >= 0) {
            $('#game-countdown').html(i);

        }
        if (i === 0) {
            clearInterval(i);
            // funcao para delay de 5 segundos antes do resultado
        }
    }, 1000);
})();


// Flip Card //

function flipCard() {
    if (lockBoard) return;
    if (this === firstCard) return;

    $(this).addClass('flip');

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

// Attempts - Update counter 
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