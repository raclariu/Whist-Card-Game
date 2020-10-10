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
	console.log('Prepared deck values and suits:', valuesAndSuits);
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
	console.log('All values to generate a new deck with:', arr);
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
	console.log('Create rounds array:', cardsDealt.length, 'rounds', cardsDealt);
}

// * Calculate total number of cards to draw each round
const calcCardsToDraw = () => cardsDealt[round] * playersData.length;

// * Calculate starting players based on selection
function getPlayersCount() {
	switch (playerCountSelect.value) {
		case '2-players':
			console.log('Getting players count...');
			playersData.splice(2, 2);
			playerContainers[2].remove();
			playerContainers[3].remove();
			playerCardsEls[2].remove();
			playerCardsEls[3].remove();
			break;
		case '3-players':
			console.log('Getting players count...');
			playersData.splice(3, 1);
			playerContainers[3].remove();
			playerCardsEls[3].remove();
			break;
		default:
			console.log('Getting players count...');
			break;
	}
	playerContainers = document.querySelectorAll('.players__container');
	playerCardsEls = document.querySelectorAll('.players__cards');
	getRandomPlayer();
}

// * Shuffle deck function
async function shuffleDeck() {
	try {
		const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
		const data = await response.json();
		console.log(`Deck ${deckId} shuffled...`, data);
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

		console.log(`Generated new deck for ${playerCountSelect.value}...`, data);
		return deckId;
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
		console.log('Deck ID already in localStorage, no need to generate a new one');
		return deckId;
	} else {
		const waitNewDeck = await genNewDeck();
		return waitNewDeck;
	}
}

// * Show cards in each container for each player
async function showCardsinDom() {
	console.log('Showing cards to the DOM...');
	let index = 0;
	playerCardsEls.forEach(element => {
		const hand = playersData[index].hand;
		element.innerHTML = hand.map(card => `<img src="${card.image}" class="card" draggable="true" />`).join('');
		index++;
	});
	return true;
}

// * Split cards to players
async function dealCards(data) {
	console.log(`Dealing ${cardsDealt[round]} cards to each player...`);
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
	return true;
}

// * Draw cards
async function drawCardsFromDeck(num) {
	try {
		const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${num}`);
		const data = await response.json();
		const cards = [ ...data.cards ];
		console.log(`Draw ${num} cards...`, data);
		return cards;
	} catch (error) {
		console.log('drawCardsFromDeck() error ->', error);
	}
}

// * Create space to play cards for each player + trump card element
function createCardSpaces() {
	console.log(`Created ${playersData.length} spaces for cards to be played in + trump card space`);
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
	console.log('Showing trump card to the DOM:', card[0].value, 'of', card[0].suit);
	if (cardsDealt[round] !== 8) {
		const trumpCardEl = document.querySelector('.container__trump-space');
		trumpCardEl.innerHTML = `<img src="${card[0].image}" class="trump-card" draggable="false" />`;
		predictHandsWon();
	} else return console.log('no trump card this round');
}

// * Start round
async function startRound() {
	try {
		console.log('Starting round...');
		await shuffleDeck();
		const num = calcCardsToDraw();
		const cards = await drawCardsFromDeck(num);
		if (cards.length > 1) await dealCards(cards);
		await showCardsinDom();
		dragDrop();
		const trump = await drawCardsFromDeck(1);
		await drawTrumpCard(trump);
		gameStart();
	} catch (error) {
		console.log('startRound() error ->', error);
	}
}

async function startNewGame() {
	console.log('Starting new game...');
	getPlayersCount();
	createRoundsArr();
	prepareDeck();
	createCardSpaces();
	menu.remove();
	leftSide.style.display = 'flex';
	rightSide.style.display = 'flex';
	await checkDeckId();
	startRound();
}

// * Event listeners
newGameBtn.addEventListener('click', startNewGame);

// * Modal listeners
rulesBtn.addEventListener('click', () => modal.classList.add('show-modal'));
window.addEventListener('click', e => (e.target === modal ? modal.classList.remove('show-modal') : false));
closeModalIcon.addEventListener('click', () => modal.classList.remove('show-modal'));
