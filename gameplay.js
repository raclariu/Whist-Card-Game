let currPlayerIndex;
const getRandomPlayer = () => {
	console.log('Player count:', startOfRoundData.length);
	currPlayerIndex = Math.floor(Math.random() * startOfRoundData.length);
	console.log('Get random starting player index:', currPlayerIndex);
};
let currRoundPlayedCards = 0;
let cardsPlayed = 0;
let gameData = [];

async function predictHandsWon(index) {
	let playerIndex;
	index === undefined ? (playerIndex = currPlayerIndex) : (playerIndex = index);
	console.log(playerIndex);

	const currPlayerData = startOfRoundData[playerIndex];
	const predictContainer = document.querySelector(
		`.${currPlayerData.player.toLowerCase()}__container .predict-container`
	);

	if (gameData.length === startOfRoundData.length - 1) {
		let totalPredictions = gameData.reduce((acc, currVal) => {
			let x = acc + currVal.predict;
			console.log('x', x);
			return x;
		}, 0);
		console.log('reduce', totalPredictions);
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
	gameData.push({ round: round, player: playerData.player.toLowerCase(), predict: parseInt(e.target.value) });

	index + 1 < startOfRoundData.length ? (newIndex = index + 1) : (newIndex = 0);

	predictContainer.remove();
	if (gameData.length === startOfRoundData.length) {
		gameStart();
	} else {
		predictHandsWon(newIndex);
	}
}

function calculateScore() {
	const dropSpaces = document.querySelectorAll('.container__card-space');
	gameplayHeadline.innerHTML = `Calculating score...`;
	cardsPlayed = 0;
	setTimeout(() => {
		dropSpaces.forEach(space => {
			space.children[0].remove();
		});
		gameStart();
	}, 3000);
	// * Here
}

function checkRoundFinish() {
	if (cardsPlayed === startOfRoundData.length) {
		return calculateScore();
	}
	gameStart();
}

function gameStart() {
	const currPlayerObj = startOfRoundData[currPlayerIndex];
	gameplayHeadline.innerHTML = `<span style="color:var(--${currPlayerObj.player.toLowerCase()}-color">${currPlayerObj.player}</span> must play a card...`;
	const currPlayerContainer = document.querySelector(`[data-player="${currPlayerObj.player.toLowerCase()}"]`);
	currPlayerContainer.classList.add('current-turn');
	currPlayerIndex + 1 === startOfRoundData.length ? (currPlayerIndex = 0) : currPlayerIndex++;
}
