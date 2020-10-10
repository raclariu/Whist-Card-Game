let randomPlayer = Math.floor(Math.random() * playersData.length);
let currPlayerIndex = randomPlayer;
let currRoundPlayedCards = 0;
let cardsPlayed = 0;

function predictHandsWon() {
	locked = true;
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
	if (cardsPlayed === playersData.length) {
		return calculateScore();
	}
	gameStart();
}

function gameStart() {
	const currPlayerObj = playersData[currPlayerIndex];
	console.log(currPlayerObj);
	gameplayHeadline.innerHTML = `<span style="color:var(--${currPlayerObj.player.toLowerCase()}-color">${currPlayerObj.player}</span> must play a card...`;
	const currPlayerContainer = document.querySelector(`[data-player="${currPlayerObj.player.toLowerCase()}"]`);
	currPlayerContainer.classList.add('current-turn');
	currPlayerIndex + 1 === playersData.length ? (currPlayerIndex = 0) : currPlayerIndex++;
}
