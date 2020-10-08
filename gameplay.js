let randomPlayer = Math.floor(Math.random() * playersData.length);
let currPlayerIndex = randomPlayer;
let currRoundPlayedCards = 0;

function gameStart() {
	const currPlayerObj = playersData[currPlayerIndex];
	gameplayHeadline.innerHTML = `<span style="color:var(--${currPlayerObj.player.toLowerCase()}-color">${currPlayerObj.player}</span> must play a card...`;
	const currPlayerContainer = document.querySelector(`[data-player="${currPlayerObj.player.toLowerCase()}"]`);
	currPlayerContainer.classList.add('current-turn');

	if (currPlayerIndex + 1 === playersData.length) {
		currPlayerIndex = 0;
	} else {
		currPlayerIndex++;
	}
}
