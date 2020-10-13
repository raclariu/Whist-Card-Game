let currPlayerIndex;
const getRandomPlayer = () => {
	console.log('Player count:', startOfRoundData.length);
	currPlayerIndex = Math.floor(Math.random() * startOfRoundData.length);
	console.log('Get random starting player index:', currPlayerIndex);
};
let currRoundPlayedCards = 0;
let cardsPlayed = 0;
let roundData = [];
let allData = [];

async function predictHandsWon(newIndex) {
	let playerIndex;
	newIndex === undefined ? (playerIndex = currPlayerIndex) : (playerIndex = newIndex);
	console.log('pind', playerIndex);

	const currPlayerData = startOfRoundData[playerIndex];
	console.log('currPlayerData', currPlayerData);
	const currPlayerName = currPlayerData.player;
	const predictContainer = document.getElementById(`${currPlayerName}-predict`);
	console.log('.${currPlayerData.player}', currPlayerData.player);
	console.log('.${currPlayerName}', currPlayerName);
	console.log('playerIndex', playerIndex);

	console.dir(predictContainer);
	if (roundData.length === startOfRoundData.length - 1) {
		let totalPredictions = roundData.reduce((acc, currVal) => {
			let total = acc + currVal.predict;
			return total;
		}, 0);
		for (let i = 0; i <= cardsDealt[round]; i++) {
			if (i !== cardsDealt[round] - totalPredictions) {
				const predictButton = document.createElement('button');
				predictButton.setAttribute('value', i);
				predictButton.innerHTML = `${i}`;
				predictButton.classList.add('predict-btn');
				predictContainer.appendChild(predictButton);
			}
		}
	} else {
		for (let i = 0; i <= cardsDealt[round]; i++) {
			const predictButton = document.createElement('button');
			predictButton.setAttribute('value', i);
			predictButton.innerHTML = `${i}`;
			predictButton.classList.add('predict-btn');
			predictContainer.appendChild(predictButton);
		}
	}

	const predictBtns = document.querySelectorAll('.predict-btn');
	predictBtns.forEach(btn => {
		btn.addEventListener('click', e => {
			test(e, playerIndex, currPlayerData, predictContainer);
		});
	});
}

function test(e, index, playerData, predictContainer) {
	let newIndex;
	roundData.push({
		round    : round,
		player   : playerData.player,
		predict  : parseInt(e.target.value),
		handsWon : 0,
		score    : 0
	});

	index + 1 < startOfRoundData.length ? (newIndex = index + 1) : (newIndex = 0);

	predictContainer.innerHTML = '';
	if (roundData.length === startOfRoundData.length) {
		gameStart();
	} else {
		predictHandsWon(newIndex);
	}
}

function addCardToRoundData(card) {
	let ownerIndex = roundData.findIndex(data => data.player === card.dataset.owner);
	roundData[ownerIndex].playedValue = card.dataset.value;
	roundData[ownerIndex].playedSuit = card.dataset.suit;
}

function calculateScore() {
	let indexCopy = currPlayerIndex;
	const dropSpaces = document.querySelectorAll('.container__card-space');
	gameplayHeadline.innerHTML = `Calculating score...`;
	cardsPlayed = 0;
	setTimeout(() => {
		dropSpaces.forEach(space => {
			space.children[0].remove();
		});
		// >> HEre, later on, if no players have any cards left, start a new round instead of gameStart()
		const checkEmptyHands = playerCardsEls.filter(element => element.childElementCount === 0);
		console.log('empty hands', checkEmptyHands);
		if (checkEmptyHands.length === startOfRoundData.length) {
			console.log('NEW ROUND');
			allData.push(roundData);
			roundData = [];
			startOfRoundData.forEach(player => (player.hand = []));
			round++;
			indexCopy + 1 === startOfRoundData.length ? (indexCopy = 0) : indexCopy++;
			currPlayerIndex = indexCopy;
			console.log('indexcopy', indexCopy);
			startRound();
		} else {
			console.log('NEW TURN');
			roundData.forEach(player => {
				player.playedSuit = undefined;
				player.playedValue = undefined;
			});
			gameStart();
		}
	}, 3000);
	// * When each player finished playing a card, calculate hands won
	const filterTrump = roundData
		.filter(player => player.playedSuit === trumpCard.dataset.suit)
		.sort((a, b) => b.playedValue - a.playedValue);

	if (filterTrump.length === 0) {
		const filterSuit = roundData
			.filter(player => player.playedSuit === roundData[0].playedSuit)
			.sort((a, b) => b.playedValue - a.playedValue);
		const index = roundData.findIndex(playerObj => playerObj.player === filterSuit[0].player);
		roundData[index].handsWon++;
		//currPlayerIndex = index;
	} else {
		const index = roundData.findIndex(playerObj => playerObj.player === filterTrump[0].player);
		roundData[index].handsWon++;
		//currPlayerIndex = index;
	}
}

function checkRoundFinish() {
	if (cardsPlayed === startOfRoundData.length) {
		return calculateScore();
	}
	gameStart();
}

function gameStart() {
	const currPlayerObj = startOfRoundData[currPlayerIndex];
	gameplayHeadline.innerHTML = `<span style="color:var(--${currPlayerObj.player}-color">${currPlayerObj.player}</span> must play a card...`;
	const currPlayerContainer = document.querySelector(`[data-player="${currPlayerObj.player}"]`);
	currPlayerContainer.classList.add('current-turn');
	currPlayerIndex + 1 === startOfRoundData.length ? (currPlayerIndex = 0) : currPlayerIndex++;
}
