const cardsElement = document.getElementById("cards");
const scoreElement = document.getElementById("score");
const clapAudioElement = document.getElementById("clap");
const correctAudioElement = document.getElementById("correct");

// states
let currentImages = images01;
let lastCard = null;
let freeze = false;
let score = 0;
let totalScore = score;

function prepareCards(images = []) {
  const uniqueCards = images.map((image, id) => ({ image, id }));
  return shuffleArray([].concat(uniqueCards, uniqueCards));
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function incrementScore() {
  score++;
  totalScore++;
  scoreElement.textContent = totalScore;
}

function verifyGame() {
  if (score === currentImages.length) {
    cardsElement.setAttribute("win", "");
    clapAudioElement.play();
    fadeOut(clapAudioElement);
    setTimeout(initGame, 5000);
  }
}

function verifyCards(nextCard) {
  if (!lastCard) {
    lastCard = nextCard;
    return;
  }

  if (lastCard.id === nextCard.id) {
    nextCard.el.disabled = true;
    lastCard.el.disabled = true;
    lastCard = null;
    correctAudioElement.play();
    incrementScore();
    verifyGame();
    return;
  }

  freeze = true;
  setTimeout(() => {
    nextCard.el.setAttribute("open", "false");
    lastCard.el.setAttribute("open", "false");
    setTimeout(() => {
      nextCard.el.removeAttribute("open");
      lastCard.el.removeAttribute("open");
      lastCard = null;
      freeze = false;
    }, 350);
  }, 1000);
}

function createButtonCard({ image, id }) {
  const buttonCardElement = document.createElement("button");
  const card = { image, id, el: buttonCardElement };

  const imageElement = document.createElement("img");

  imageElement.setAttribute("src", image);

  buttonCardElement.classList.add("button-card");
  buttonCardElement.append(imageElement);
  buttonCardElement.onclick = () => {
    if (freeze) return;
    const isOpened = buttonCardElement.hasAttribute("open");
    if (isOpened) return;
    buttonCardElement.setAttribute("open", "true");
    setTimeout(() => verifyCards(card), 500);
  };

  return card;
}

function mountCards(cards = []) {
  cardsElement.innerHTML = "";
  const mountedCards = cards.map(createButtonCard);
  mountedCards.forEach(({ el }) => cardsElement.append(el));
  return mountedCards;
}

function initGame() {
  lastCard = null;
  score = 0;
  freeze = false;

  clapAudioElement.pause();
  clapAudioElement.currentTime = 0;

  cardsElement.removeAttribute("win");
  mountCards(prepareCards(currentImages));
}

function main() {
  initGame();
}

main();

function fadeOut(audioElement, volume = 1) {
  if (volume <= 0) {
    audioElement.pause();
    audioElement.volume = 1;
    audioElement.currentTime = 0;
    return;
  }
  audioElement.volume = volume;
  setTimeout(() => fadeOut(audioElement, volume - 0.05), 250);
}
