let currPlayerIndex;
const getRandomPlayer = () => {
	console.log('Player count:', playersData.length);
	currPlayerIndex = Math.floor(Math.random() * playersData.length);
	console.log('Get random starting player index:', currPlayerIndex);
};
let currRoundPlayedCards = 0;
let cardsPlayed = 0;

function predictHandsWon() {}

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
	gameplayHeadline.innerHTML = `<span style="color:var(--${currPlayerObj.player.toLowerCase()}-color">${currPlayerObj.player}</span> must play a card...`;
	const currPlayerContainer = document.querySelector(`[data-player="${currPlayerObj.player.toLowerCase()}"]`);
	currPlayerContainer.classList.add('current-turn');
	currPlayerIndex + 1 === playersData.length ? (currPlayerIndex = 0) : currPlayerIndex++;
}
