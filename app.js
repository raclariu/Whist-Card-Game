// DOM elements
const menu = document.getElementById('menu');
const newGameBtn = document.querySelector('.new-game__start');
const playerCountSelect = document.querySelector('.new-game__player-count');
const modal = document.getElementById('modal-container');
const closeModalIcon = document.querySelector('.fa-window-close');
const rulesBtn = document.querySelector('.new-game__rules');
const leftSide = document.getElementById('players');
const rightSide = document.getElementById('play-area');
const playCardsContainer = document.querySelector('.play-area__cards-container');
let gameplayHeadline = document.querySelector('.play-area__headline');
let playerContainers = document.querySelectorAll('.players__container');
let playerCardsEls = document.querySelectorAll('.players__cards');
let lockedGame = false;

// Round is uses to keep track of round and also how many cards are dealt in a specific round
// It will be used as indice for cardsDealt array (cardsDealt[round])
let valuesAndSuits;
let cardsDealt;
let round = 7;
let deckId;
let handIndex = 0;
let playersData = [
	{ player: 'Orange', hand: [], score: 0, handsWon: 0 },
	{ player: 'Cyan', hand: [], score: 0, handsWon: 0 },
	{ player: 'Magenta', hand: [], score: 0, handsWon: 0 },
	{ player: 'Lime', hand: [], score: 0, handsWon: 0 }
];

// * Prepare values of cards needed
function prepareDeck() {
	const suits = [ 'S', 'D', 'C', 'H' ];
	let values = [ 7, 8, 9, 0, 'A', 'J', 'Q', 'K' ];
	if (playerCountSelect.value === '2-players') {
		values.splice(0, 4);
	} else if (playerCountSelect.value === '3-players') {
		values.splice(0, 2);
	}
	valuesAndSuits = [ ...[ values ], ...[ suits ] ];
	return valuesAndSuits;
}

// * Function that returns a string with all possible card values and suits to be used in API call
function apiCardList() {
	let arr = [];
	for (let cardValue of valuesAndSuits[0]) {
		for (let suit of valuesAndSuits[1]) {
			arr.push(cardValue + suit);
		}
	}

	return arr.join(',');
}

// * Calculate number of rounds
// * Each array item represents the number of cards the player will have in hand for the respective round
// * Array length is the total number of rounds in the game
function createRoundsArr() {
	const twoToSeven = [ 2, 3, 4, 5, 6, 7 ];
	const roundOneTimes = [];
	const roundEightTimes = [];
	for (let i = 0; i < playersData.length; i++) {
		roundOneTimes.push(1);
		roundEightTimes.push(8);
	}
	cardsDealt = [ ...roundOneTimes, ...twoToSeven, ...roundEightTimes, ...twoToSeven.reverse(), ...roundOneTimes ];
}

// * Calculate total number of cards to draw each round
const calcCardsToDraw = () => {
	console.log('calcCardsToDraw');
	return cardsDealt[round] * playersData.length;
};

// * Calculate starting players based on selection
function getPlayersCount() {
	switch (playerCountSelect.value) {
		case '2-players':
			playersData.splice(2, 2);
			playerContainers[2].remove();
			playerContainers[3].remove();
			playerCardsEls[2].remove();
			playerCardsEls[3].remove();
			break;
		case '3-players':
			playersData.splice(3, 1);
			playerContainers[3].remove();
			playerCardsEls[3].remove();
			break;
		default:
			break;
	}
	playerContainers = document.querySelectorAll('.players__container');
	playerCardsEls = document.querySelectorAll('.players__cards');
}

// * Shuffle deck function
async function shuffleDeck() {
	try {
		const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
		const data = await response.json();
		console.log('shuffled ---', data);
		return data;
	} catch (error) {
		console.log('shuffleDeck() error ->', error);
	}
}

// * Generate a new deck of cards
async function genNewDeck() {
	try {
		const cardList = apiCardList();
		const response = await fetch(`https://deckofcardsapi.com/api/deck/new/shuffle/?cards=${cardList}`);
		const data = await response.json();

		deckId = data.deck_id;
		localStorage.setItem('deck_id', deckId);
		localStorage.setItem('player_count', playerCountSelect.value);

		console.log(`generated deck for ${playerCountSelect.value} ---`, data);
	} catch (error) {
		console.log('genNewDeck() error ->', error);
	}
}

// * Check if deck exists in localStorage
async function checkDeckId() {
	const lsDeckId = localStorage.getItem('deck_id');
	const lsPlayerCount = localStorage.getItem('player_count');

	if (lsDeckId && lsPlayerCount === playerCountSelect.value) {
		deckId = localStorage.getItem('deck_id');
		console.log('deck already in LS');
	} else {
		genNewDeck();
	}
}

// * Show cards in each container for each player
function showCardsinDom() {
	let index = 0;
	playerCardsEls.forEach(element => {
		const hand = playersData[index].hand;
		element.innerHTML = hand.map(card => `<img src="${card.image}" class="card" draggable="true" />`).join('');
		index++;
	});
	dragDrop();
	gameStart();
}

// * Split cards to players
function dealCards(data) {
	const cards = [ ...data ];
	while (cards.length !== 0) {
		const poppedCard = cards.pop();

		playersData[handIndex].hand.push(poppedCard);
		if (handIndex === playersData.length - 1) {
			handIndex = 0;
		} else {
			handIndex++;
		}
	}
	showCardsinDom();
}

// * Draw cards
async function drawCardsFromDeck(num) {
	try {
		console.log('draw');
		const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${num}`);
		const data = await response.json();
		console.log(`draw ${num} cards ---`, data);
		const cards = [ ...data.cards ];
		console.log('draw after');
		if (num !== 1) dealCards(cards);
		return cards;
	} catch (error) {
		console.log('drawCardsFromDeck() error ->', error);
	}
}

// * Create space to play cards for each player + trump card element
function createCardSpaces() {
	for (let player in playersData) {
		const space = document.createElement('div');
		space.classList.add('container__card-space');
		playCardsContainer.appendChild(space);
	}
	const trumpCardSpace = document.createElement('div');
	trumpCardSpace.classList.add('container__trump-space');
	playCardsContainer.appendChild(trumpCardSpace);
}

// * Draw trump card if players don't use 8 cards this round
async function drawTrumpCard(card) {
	console.log('trump');
	if (cardsDealt[round] !== 8) {
		const trumpCardEl = document.querySelector('.container__trump-space');
		trumpCardEl.innerHTML = `<img src="${card[0].image}" class="trump-card" draggable="false" />`;
		console.log('trump after');
		predictHandsWon();
	} else return console.log('no trump card this round');
}

// * Event listeners
newGameBtn.addEventListener('click', () => {
	getPlayersCount();
	createRoundsArr();
	prepareDeck();
	checkDeckId();
	shuffleDeck()
		.then(() => drawCardsFromDeck(calcCardsToDraw()))
		.then(() => drawCardsFromDeck(1))
		.then(card => drawTrumpCard(card));

	menu.remove();
	createCardSpaces();
	leftSide.style.display = 'flex';
	rightSide.style.display = 'flex';
});

// * Modal listeners
rulesBtn.addEventListener('click', e => {
	modal.classList.add('show-modal');
});

window.addEventListener('click', e => (e.target === modal ? modal.classList.remove('show-modal') : false));

closeModalIcon.addEventListener('click', e => {
	modal.classList.remove('show-modal');
});
