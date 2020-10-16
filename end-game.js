// * End game
function endGame() {
	console.log('Ending game...');
	const cardSpaces = document.querySelectorAll('.play-area__cards-container div');
	cardSpaces.forEach(space => space.remove());
	gameplayHeadline.innerHTML = 'Game has ended';
	const finalScoreContainer = document.createElement('div');
	finalScoreContainer.classList.add('end-container');
	startOfRoundData.forEach(obj => {
		console.log(obj);
		const scoreDiv = document.createElement('div');
		scoreDiv.classList.add('end-player-container');
		console.log(scoreDiv.innerText);
		if (obj.player === 'orange')
			scoreDiv.innerHTML = `<span class="end-player ${obj.player}">${obj.player}</span><span class="end-score">${orangeScoreText.innerText}</span>`;
		if (obj.player === 'cyan')
			scoreDiv.innerHTML = `<span class="end-player ${obj.player}">${obj.player}</span><span class="end-score">${cyanScoreText.innerText}</span>`;
		if (obj.player === 'magenta')
			scoreDiv.innerHTML = `<span class="end-player ${obj.player}">${obj.player}</span><span class="end-score">${magentaScoreText.innerText}</span>`;
		if (obj.player === 'lime')
			scoreDiv.innerHTML = `<span class="end-player ${obj.player}">${obj.player}</span><span class="end-score">${limeScoreText.innerText}</span>`;

		finalScoreContainer.appendChild(scoreDiv);
		console.log(scoreDiv);
	});
	playCardsContainer.style.width = '100%';
	playCardsContainer.appendChild(finalScoreContainer);

	const detailedResultsBtn = document.createElement('button');
	detailedResultsBtn.classList.add('detailed-results-btn');
	detailedResultsBtn.innerText = 'Detailed results';
	finalScoreContainer.appendChild(detailedResultsBtn);
	const detailedResultsBtnEl = document.querySelector('.detailed-results-btn');
	detailedResultsBtnEl.addEventListener('click', showDetailedScore);
}

function showDetailedScore() {
	const table = document.createElement('table');
	table.classList.add('modal-table');
	allData.forEach(arr => {
		console.log(arr);
		const filterOrange = arr.filter(obj => obj.player === 'orange')[0];
		const filterCyan = arr.filter(obj => obj.player === 'cyan')[0];
		const filterMagenta = arr.filter(obj => obj.player === 'magenta')[0];
		const filterLime = arr.filter(obj => obj.player === 'lime')[0];
		console.log(filterOrange.handsWon);
		const row = document.createElement('tbody');
		if (startOfRoundData.length === 2) {
			row.innerHTML = `
		<tbody>
		<tr>
			<td>Round ${filterOrange.round}</td>
			<td>orange</td>
			<td>cyan</td>
		</tr>
		<tr>
			<td>predict</td>
			<td>${filterOrange.predict}</td>
			<td>${filterCyan.predict}</td>
		</tr>
		<tr>
			<td>hands won</td>
			<td>${filterOrange.handsWon}</td>
			<td>${filterCyan.handsWon}</td>
		</tr>
		<tr>
			<td>score</td>
			<td>${filterOrange.score}</td>
			<td>${filterCyan.score}</td>
		</tr>
		</tbody>
        `;
			modal.classList.add('show-modal');
			table.appendChild(row);
			console.log(table);
			console.dir(table);
			modal.innerHTML = '';
			modal.appendChild(table);
		} else if (startOfRoundData.length === 3) {
			row.innerHTML = `
		<tbody>
		<tr>
			<td>Round ${filterOrange.round}</td>
			<td>orange</td>
			<td>cyan</td>
			<td>magenta</td>
		</tr>
		<tr>
			<td>predict</td>
			<td>${filterOrange.predict}</td>
			<td>${filterCyan.predict}</td>
			<td>${filterMagenta.predict}</td>
		</tr>
		<tr>
			<td>hands won</td>
			<td>${filterOrange.handsWon}</td>
			<td>${filterCyan.handsWon}</td>
			<td>${filterMagenta.handsWon}</td>
		</tr>
		<tr>
			<td>score</td>
			<td>${filterOrange.score}</td>
			<td>${filterCyan.score}</td>
			<td>${filterMagenta.score}</td>
		</tr>
		</tbody>
        `;
			modal.classList.add('show-modal');
			table.appendChild(row);
			console.log(table);
			console.dir(table);
			modal.innerHTML = '';
			modal.appendChild(table);
		} else {
			row.innerHTML = `
		<tbody>
		<tr>
			<td>Round ${filterOrange.round}</td>
			<td>orange</td>
			<td>cyan</td>
			<td>magenta</td>
			<td>lime</td>
		</tr>
		<tr>
			<td>predict</td>
			<td>${filterOrange.predict}</td>
			<td>${filterCyan.predict}</td>
			<td>${filterMagenta.predict}</td>
			<td>${filterLime.predict}</td>
		</tr>
		<tr>
			<td>hands won</td>
			<td>${filterOrange.handsWon}</td>
			<td>${filterCyan.handsWon}</td>
			<td>${filterMagenta.handsWon}</td>
			<td>${filterLime.handsWon}</td>
		</tr>
		<tr>
			<td>score</td>
			<td>${filterOrange.score}</td>
			<td>${filterCyan.score}</td>
			<td>${filterMagenta.score}</td>
			<td>${filterLime.score}</td>
		</tr>
		</tbody>
        `;
			modal.classList.add('show-modal');
			table.appendChild(row);
			console.log(table);
			console.dir(table);
			modal.innerHTML = '';
			modal.appendChild(table);
		}
	});
}
