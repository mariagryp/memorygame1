//Global referenser
const cards = document.querySelectorAll(".card"); //referens for card element
let firstCard; //referens for a first card selected by a player
let secondCard; //referens for a second card selected by a player
let newGameBtn = document.querySelector(".start-btn"); // referens till start knappen

let cardFlipped = false;
let lockBoard = false;
let players = [];

//let p1Turn = true;
let player1 = true;
let player2;
let currentPlayerIndex = 0;

let player1Score = 0; //score for a player 1
let player2Score = 0; //score for a player 2

document.querySelector(".player1Score").textContent = player1Score;
document.querySelector(".player2Score").textContent = player2Score;

function init() {
  newGameBtn.addEventListener("click", submitForm);
}
window.addEventListener("load", init); //init aktiveras då sidan är inladdad

function submitForm(e) {
  e.preventDefault();
  let user1 = document.querySelector("#user_1").value;
  let user2 = document.querySelector("#user_2").value;

  if (user1 !== " " && user2 !== " ") {
    players.push({ name: user1, score: 0 });
    players.push({ name: user2, score: 0 });

    document.querySelector(".player1").textContent = user1;
    document.querySelector(".player2").textContent = user2;

    //disable form and button when
    document.querySelector("#user_1").disabled = true;
    document.querySelector("#user_2").disabled = true;
    document.querySelector('button[type="submit"]').disabled = true;

    setActivePlayerStyle();
  }
}

function setActivePlayerStyle() {
  let player1Elements = document.getElementsByClassName("player1");
  let player2Elements = document.getElementsByClassName("player2");

  let player1Array = Array.from(player1Elements);
  let player2Array = Array.from(player2Elements);

  let players = player1Array.concat(player2Array);

  //const playerElements = document.querySelectorAll(".player");
  players.forEach((playerElement, index) => {
    if (index === currentPlayerIndex) {
      playerElement.classList.add("active");
    } else {
      playerElement.classList.remove("active");
    }
  });
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flip");

  if (!cardFlipped) {
    cardFlipped = true;
    firstCard = this;
    return;
  }

  secondCard = this;

  checkForMatch();
  switchPlayer();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
  isMatch ? disableCards() : unflipCards(); //ternary operator if matched is true then disable cards,
  //if not/else then flip cards

  if (isMatch) {
    if (currentPlayerIndex === 0) {
      player1Score++;
      document.querySelector(".player1Score").textContent = player1Score;
    } else {
      player2Score++;
      document.querySelector(".player2Score").textContent = player2Score;
    }

    if (player1Score + player2Score === cards.length / 2) {
      endGame();
    } else {
      switchPlayer();
    }
  }
}

function switchPlayer() {
  currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  setActivePlayerStyle();
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);

  resetBoard();
}

function unflipCards() {
  lockBoard = true;

  setTimeout(() => {
    firstCard.classList.remove("flip");
    secondCard.classList.remove("flip");

    resetBoard();
  }, 1500);
}

//reset the game board
function resetBoard() {
  [cardFlipped, lockBoard] = [false, false];
  [firstCard, secondCard] = [null, null];
}

//shuffle the cards
(function shuffle() {
  cards.forEach((card) => {
    let randomCard = Math.floor(Math.random() * 12);
    card.style.order = randomCard;
  });
})();

function endGame() {
  let winner;
  if (player1Score > player2Score) {
    winner = players[0].name;
  } else if (player1Score < player2Score) {
    winner = players[1].name;
  } else {
    return;
  }
  alert(`Congatulations, ${winner}! You won!`);
  cards.forEach((card) => card.classList.add("flip"));
}

//flip the cards by clicking on the
cards.forEach((card) => card.addEventListener("click", flipCard));
