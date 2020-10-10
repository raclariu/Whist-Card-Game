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
	console.log('index', index);
	let playerIndex;
	if (index === undefined) {
		playerIndex = currPlayerIndex;
	} else {
		playerIndex = index;
	}

	const currPlayerData = startOfRoundData[playerIndex];
	const colorContainer = document.querySelector(`.${currPlayerData.player.toLowerCase()}__container`);
	const predictContainer = document.createElement('div');
	predictContainer.classList.add('predict-container');
	colorContainer.appendChild(predictContainer);
	for (let i = 0; i <= cardsDealt[round]; i++) {
		const button = document.createElement('button');
		button.setAttribute('value', i);
		button.innerHTML = `${i}`;
		button.classList.add('predict-btn');
		predictContainer.appendChild(button);
	}
	const predictBtns = document.querySelectorAll('.predict-btn');
	predictBtns.forEach(btn => {
		btn.addEventListener('click', e => {
			test(e, playerIndex, currPlayerData, predictContainer);
		});
	});
}

function test(e, index, playerData, predictContainer) {
	console.log('fff', playerData);
	console.dir(e);
	gameData.push({ round: round, player: playerData.player.toLowerCase(), predict: e.target.value });
	let newIndex;
	if (index + 1 < startOfRoundData.length) {
		newIndex = index + 1;
	} else {
		newIndex = 0;
	}
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
