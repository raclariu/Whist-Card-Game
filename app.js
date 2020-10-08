const cardsDealt = [ 1, 1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 8, 8, 8, 8, 8, 8, 8, 7, 6, 5, 4, 3, 2, 1, 1, 1, 1 ];

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

let playerContainers = document.querySelectorAll('.players__container');
let playerCardsEls = document.querySelectorAll('.players__cards');

// Round is uses to keep track of round and also how many cards are dealt in a specific round
// It will be used as indice for cardsDealt array (cardsDealt[round])
let valuesAndSuits;
let round = 0;
let deckId;
let handIndex = 0;
let playersData = [
	{ orange: 'orange', hand: [], score: 0, handsWon: 0 },
	{ cyan: 'cyan', hand: [], score: 0, handsWon: 0 },
	{ magenta: 'magenta', hand: [], score: 0, handsWon: 0 },
	{ lime: 'lime', hand: [], score: 0, handsWon: 0 }
];

// Prepare number of cards in deck based on num of players
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

// * Function that returns a string with all possible card values and suits to be used inAPI call
function apiCardList() {
	let arr = [];
	for (let cardValue of valuesAndSuits[0]) {
		for (let suit of valuesAndSuits[1]) {
			arr.push(cardValue + suit);
		}
	}

	return arr.join(',');
}

// * Calculate number of cards to draw each round
const calcCardsToDraw = () => cardsDealt[round] * playersData.length;

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

	//test
	dragDrop();
}

// * Split cards to players
function dealCards(data) {
	const newData = [ ...data ];
	while (newData.length !== 0) {
		const poppedCard = newData.pop();

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
		const response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=${num}`);
		const data = await response.json();
		console.log(`draw ${num} cards ---`, data);
		const cards = [ ...data.cards ];
		dealCards(cards);
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
	const trumpCard = document.createElement('div');
	trumpCard.classList.add('container__trump-space');
	playCardsContainer.appendChild(trumpCard);
}

// * Event listeners
newGameBtn.addEventListener('click', () => {
	getPlayersCount();
	prepareDeck();
	checkDeckId();

	setTimeout(() => {
		shuffleDeck();
		setTimeout(() => {
			drawCardsFromDeck(calcCardsToDraw());
		}, 500);
	}, 500);

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

// Drag and Drop
let draggedCard;

function onDragStart(draggables) {
	draggables.forEach(draggable => {
		draggable.addEventListener('dragstart', e => {
			draggedCard = e.target;
			const canBeDragged = draggedCard.attributes.draggable.value;
			if (canBeDragged) {
				draggable.classList.add('dragging');
				console.log('dragging');
			}
		});
	});
}

function onDragEnd(draggables) {
	draggables.forEach(draggable => {
		draggable.addEventListener('dragend', e => {
			draggable.classList.remove('dragging');
			console.log('end');
			dragged = null;
			console.log(draggedCard);
		});
	});
}

function onDragOver(dropSpaces) {
	dropSpaces.forEach(space => {
		space.addEventListener('dragover', e => {
			e.preventDefault();
		});
	});
}

function onDragEnter(dropSpaces) {
	dropSpaces.forEach(space => {
		space.addEventListener('dragenter', e => {
			e.preventDefault();
			e.target.classList.add('valid-space');
			console.log('entered valid area');
		});
	});
}

function onDragLeave(dropSpaces) {
	dropSpaces.forEach(space => {
		space.addEventListener('dragleave', e => {
			e.target.classList.remove('valid-space');
			console.log('left valid area');
		});
	});
}

function onDrop(dropSpaces) {
	dropSpaces.forEach(space => {
		space.addEventListener('drop', e => {
			e.preventDefault();
			console.log('dropped');
			console.dir(e.target);
			if (e.target.classList.contains('container__card-space') && e.target.childElementCount === 0) {
				e.target.appendChild(draggedCard);
				draggedCard.setAttribute('draggable', false);
			}
		});
	});
}

function dragDrop() {
	const dropSpaces = document.querySelectorAll('.container__card-space');
	const draggables = document.querySelectorAll('img.card[draggable="true"]');
	onDragStart(draggables);
	onDragEnd(draggables);
	onDragOver(dropSpaces);
	onDragEnter(dropSpaces);
	onDragLeave(dropSpaces);
	onDrop(dropSpaces);
}