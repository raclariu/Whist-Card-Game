let currPlayerIndex;
let indexCopyTurn;
let indexCopyRound;
let currRoundPlayedCards = 0;
let cardsPlayed = 0;
let roundData = [];
let allData = [];

const getRandomPlayer = () => {
	console.log('Player count:', startOfRoundData.length);
	currPlayerIndex = Math.floor(Math.random() * startOfRoundData.length);
	indexCopyTurn = currPlayerIndex;
	indexCopyRound = currPlayerIndex;
	console.log('Get random starting player index:', currPlayerIndex);
};

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
	const prediction = parseInt(e.target.value);
	const currPredictionEl = document.querySelector(`.${playerData.player}__prediction`);
	currPredictionEl.innerHTML = prediction;
	roundData.push({
		round    : round,
		player   : playerData.player,
		predict  : prediction,
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

function updDataRoundEnd() {
	const playerPredictionSpan = document.querySelectorAll('.players__prediction');
	const playerHandsWonSpan = document.querySelectorAll('.players__hands-won');
	playerPredictionSpan.forEach(span => (span.innerHTML = '?'));
	playerHandsWonSpan.forEach(span => (span.innerHTML = '?'));
	gameplayHeadline.innerHTML = 'Predict how many hands you will win...';
	// const y = allData.filter(arr=>arr.filter(obj=>{
	// 	let arr = []
	// 	arr.push(obj)
	// 	console.log(arr);
	// }))
	let orangeScore = 0;
	let cyanScore = 0;
	let magentaScore = 0;
	let limeScore = 0;
	const orange = document.querySelector('.orange__score');
	const cyan = document.querySelector('.cyan__score');
	const magenta = document.querySelector('.magenta__score');
	const lime = document.querySelector('.lime__score');

	for (let arr of allData) {
		arr.filter(obj => (obj.player === 'orange' ? (orangeScore += obj.score) : ''));
		arr.filter(obj => (obj.player === 'cyan' ? (cyanScore += obj.score) : ''));
		arr.filter(obj => (obj.player === 'magenta' ? (magentaScore += obj.score) : ''));
		arr.filter(obj => (obj.player === 'lime' ? (limeScore += obj.score) : ''));
	}
	orange.innerHTML = orangeScore;
	cyan.innerHTML = cyanScore;
	magenta !== null ? (magenta.innerHTML = magentaScore) : '';
	lime !== null ? (lime.innerHTML = limeScore) : '';
}

function updDataTurnEnd() {
	console.log('afterTurnEnd');
}

async function calculateScore() {
	const dropSpaces = document.querySelectorAll('.container__card-space');
	let filterSuit;
	let filterTrump;
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
			updDataRoundEnd();
			roundData = [];
			startOfRoundData.forEach(player => (player.hand = []));
			round++;
			suit = undefined;
			indexCopyRound + 1 === startOfRoundData.length ? (indexCopyRound = 0) : indexCopyRound++;
			currPlayerIndex = indexCopyRound;
			startRound();
		} else {
			console.log('NEW TURN');
			updDataTurnEnd();
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
	filterSuit = roundData.filter(player => player.playedSuit === suit).sort((a, b) => b.playedValue - a.playedValue);

	if (trumpCard) {
		filterTrump = roundData
			.filter(player => player.playedSuit === trumpCard.dataset.suit)
			.sort((a, b) => b.playedValue - a.playedValue);
		// console.log(trumpCards);
		// trumpCards.length > 0 ? (filterTrump = trumpCards) : undefined;
		// console.log(filterTrump);
	}

	if (trumpCard === undefined || filterTrump.length === 0) {
		console.log('win by suit', filterSuit);
		const indexWinnerBySuit = roundData.findIndex(playerObj => playerObj.player === filterSuit[0].player);
		const winner = roundData[indexWinnerBySuit];
		winner.handsWon++;
		gameplayHeadline.innerHTML = `<span style="color:var(--${winner.player}-color">🎉 ${winner.player}</span> won this round 🎉`;
		const winnerPredictionSpan = document.querySelector(`.${winner.player}__hands-won`);
		winnerPredictionSpan.innerHTML = winner.handsWon;
		indexCopyTurn = indexWinnerBySuit;
	} else {
		console.log('FILTERTRUMP', filterTrump);
		const indexWinnerByTrump = roundData.findIndex(playerObj => playerObj.player === filterTrump[0].player);
		const winner = roundData[indexWinnerByTrump];
		winner.handsWon++;
		gameplayHeadline.innerHTML = `<span style="color:var(--${winner.player}-color">🎉 ${winner.player}</span> won this round 🎉`;
		const winnerPredictionSpan = document.querySelector(`.${winner.player}__hands-won`);
		winnerPredictionSpan.innerHTML = winner.handsWon;
		indexCopyTurn = indexWinnerByTrump;
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
