let randomPlayer = Math.floor(Math.random() * playersData.length);
let currentPlayerIndex = randomPlayer;

function checkHandWinner() {
	if (currentPlayerIndex + 1 === playersData.length) {
		currentPlayerIndex = 0;
	} else {
		currentPlayerIndex++;
	}
}

function gameStart() {
	const currentPlayer = playersData[currentPlayerIndex];
	gameplayHeadline.innerHTML = `<span style="color:var(--${currentPlayer.player.toLowerCase()}-color">${currentPlayer.player}</span> must play a card...`;
	const currentPlayerCards = document.querySelectorAll(`[data-player="${currentPlayer.player.toLowerCase()}"] img`);
	currentPlayerCards.forEach(card => {
		card.classList.add('current-turn');
	});
	checkHandWinner();
}
