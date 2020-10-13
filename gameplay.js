let currPlayerIndex;
let indexCopyTurn;
let indexCopyRound;
const getRandomPlayer = () => {
	console.log('Player count:', startOfRoundData.length);
	currPlayerIndex = Math.floor(Math.random() * startOfRoundData.length);
	indexCopyTurn = currPlayerIndex;
	indexCopyRound = currPlayerIndex;
	console.log('Get random starting player index:', currPlayerIndex);
};
let currRoundPlayedCards = 0;
let cardsPlayed = 0;
let roundData = [];
let allData = [];

async function predictHandsWon(newIndex) {
	let playerIndex;
	newIndex === undefined ? (playerIndex = currPlayerIndex) : (playerIndex = newIndex);

	const currPlayerData = startOfRoundData[playerIndex];
	const currPlayerName = currPlayerData.player;
	const predictContainer = document.getElementById(`${currPlayerName}-predict`);

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
			predictClick(e, playerIndex, currPlayerData, predictContainer);
		});
	});
}

function predictClick(e, playerIndex, playerData, predictContainer) {
	let newIndex;
	roundData.push({
		round    : round,
		player   : playerData.player,
		predict  : parseInt(e.target.value),
		handsWon : 0,
		score    : 0
	});

	playerIndex + 1 < startOfRoundData.length ? (newIndex = playerIndex + 1) : (newIndex = 0);

	predictContainer.innerHTML = '';
	if (roundData.length === startOfRoundData.length) {
		currPlayerIndex = 0;
		gameStart(currPlayerIndex);
	} else {
		predictHandsWon(newIndex);
	}
}

function addCardToRoundData(card) {
	let ownerIndex = roundData.findIndex(data => data.player === card.dataset.owner);
	roundData[ownerIndex].playedValue = card.dataset.value;
	roundData[ownerIndex].playedSuit = card.dataset.suit;
}

function updateScore() {
	roundData.forEach(player => {
		if (player.predict === player.handsWon) {
			let calculatePlus = 5 + player.predict;
			player.score += calculatePlus;
		} else if (player.predict - player.handsWon < 0) {
			let calculateMinus = player.predict - player.handsWon;
			player.score += calculateMinus;
		} else {
			let calculateMinus = player.handsWon - player.predict;
			player.score += calculateMinus;
		}
	});
}

async function calculateScore() {
	const dropSpaces = document.querySelectorAll('.container__card-space');
	gameplayHeadline.innerHTML = `Calculating score...`;
	cardsPlayed = 0;
	setTimeout(() => {
		dropSpaces.forEach(space => {
			space.children[0].remove();
		});

		const checkEmptyHands = playerCardsEls.filter(element => element.childElementCount === 0);
		console.log('empty hands', checkEmptyHands);
		if (checkEmptyHands.length === startOfRoundData.length) {
			console.log('NEW ROUND');
			updateScore();
			allData.push(roundData);
			roundData = [];
			startOfRoundData.forEach(player => (player.hand = []));
			round++;
			suit = undefined;
			indexCopyRound + 1 === startOfRoundData.length ? (indexCopyRound = 0) : indexCopyRound++;
			currPlayerIndex = indexCopyRound;
			startRound();
		} else {
			console.log('NEW TURN');
			roundData.forEach(player => {
				console.log(player.player, player.playedSuit, player.playedValue);
			});
			suit = undefined;
			roundData.forEach(player => {
				player.playedSuit = undefined;
				player.playedValue = undefined;
			});
			currPlayerIndex = indexCopyTurn;
			gameStart(indexCopyTurn);
		}
	}, 3000);
	// * When each player finished playing a card, calculate hands won

	if (cardsDealt[round] === 8) {
		console.log('SUIT', suit);
		const filterSuit = roundData
			.filter(player => player.playedSuit === suit)
			.sort((a, b) => b.playedValue - a.playedValue);
		console.log('WINNER', filterSuit[0].player, filterSuit);
		const indexWinnerBySuit = roundData.findIndex(playerObj => playerObj.player === filterSuit[0].player);
		roundData[indexWinnerBySuit].handsWon++;
		indexCopyTurn = indexWinnerBySuit;
	}

	if (cardsDealt[round] !== 8) {
		const filterTrump = roundData
			.filter(player => player.playedSuit === trumpCard.dataset.suit)
			.sort((a, b) => b.playedValue - a.playedValue);
		console.log('filterTrump', filterTrump);

		if (filterTrump.length === 0) {
			const filterSuit = roundData
				.filter(player => player.playedSuit === suit)
				.sort((a, b) => b.playedValue - a.playedValue);
			console.log('filterSuit', filterSuit);
			const indexWinnerBySuit = roundData.findIndex(playerObj => playerObj.player === filterSuit[0].player);
			roundData[indexWinnerBySuit].handsWon++;
			indexCopyTurn = indexWinnerBySuit;
		} else {
			const indexWinnerByTrump = roundData.findIndex(playerObj => playerObj.player === filterTrump[0].player);
			roundData[indexWinnerByTrump].handsWon++;
			indexCopyTurn = indexWinnerByTrump;
		}
	}
}

function checkRoundFinish() {
	if (cardsPlayed === startOfRoundData.length) {
		return calculateScore();
	}
	gameStart(currPlayerIndex);
}

function gameStart(index) {
	const currPlayerObj = roundData[index];

	gameplayHeadline.innerHTML = `<span style="color:var(--${currPlayerObj.player}-color">${currPlayerObj.player}</span> must play a card...`;
	const currPlayerContainer = document.querySelector(`[data-player="${currPlayerObj.player}"]`);
	currPlayerContainer.classList.add('current-turn');
	currPlayerIndex + 1 === startOfRoundData.length ? (currPlayerIndex = 0) : currPlayerIndex++;
}
