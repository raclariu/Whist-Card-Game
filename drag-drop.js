// Drag and Drop
let draggedCard;

function onDragStart(draggables) {
	draggables.forEach(draggable => {
		draggable.addEventListener('dragstart', e => {
			draggedCard = e.target;

			const canBeDragged = draggedCard.attributes.draggable.value;
			if (canBeDragged) {
				draggable.classList.add('dragging');
			}
		});
	});
}

function onDragEnd(draggables) {
	draggables.forEach(draggable => {
		draggable.addEventListener('dragend', e => {
			draggable.classList.remove('dragging');
			draggedCard = null;
		});
	});
}

function onDragOver(dropSpaces) {
	dropSpaces.forEach(space => {
		space.addEventListener('dragover', e => {
			e.preventDefault();
		});
	});
}

function onDragEnter(dropSpaces) {
	dropSpaces.forEach(space => {
		space.addEventListener('dragenter', e => {
			e.preventDefault();
			e.target.classList.add('valid-space');
		});
	});
}

function onDragLeave(dropSpaces) {
	dropSpaces.forEach(space => {
		space.addEventListener('dragleave', e => {
			e.target.classList.remove('valid-space');
		});
	});
}

function onDrop(dropSpaces) {
	dropSpaces.forEach(space => {
		space.addEventListener('drop', e => {
			e.preventDefault();
			e.target.classList.remove('valid-space');
			let draggedParent = draggedCard.parentElement;
			if (draggedParent.classList.contains('current-turn')) {
				if (e.target.classList.contains('container__card-space') && e.target.childElementCount === 0) {
					let suit = roundData[0].playedSuit;
					if (suit === undefined) {
						suit = draggedCard.dataset.suit;
					}
					console.log('suit', suit);

					if (cardsDealt[round] !== 8) {
						if (draggedCard.dataset.suit === suit || draggedCard.dataset.suit === trumpCard.dataset.suit) {
							e.target.appendChild(draggedCard);
							draggedCard.setAttribute('draggable', false);
							draggedParent.classList.remove('current-turn');
							cardsPlayed++;
							addCardToRoundData(draggedCard);
							console.dir(draggedCard);
							checkRoundFinish();
						} else {
							const current = [
								...document.querySelectorAll(`[data-player="${draggedCard.dataset.owner}"] img`)
							];
							const filter = current.filter(
								card => card.dataset.suit === trumpCard.dataset.suit || card.dataset.suit === suit
							);
							if (filter.length == 0) {
								e.target.appendChild(draggedCard);
								draggedCard.setAttribute('draggable', false);
								draggedParent.classList.remove('current-turn');
								cardsPlayed++;
								addCardToRoundData(draggedCard);
								console.dir(draggedCard);
								checkRoundFinish();
							}
						}
					} else {
						console.log('here');
						if (draggedCard.dataset.suit === suit) {
							e.target.appendChild(draggedCard);
							draggedCard.setAttribute('draggable', false);
							draggedParent.classList.remove('current-turn');
							cardsPlayed++;
							addCardToRoundData(draggedCard);
							console.dir(draggedCard);
							checkRoundFinish();
						} else {
							const current = [
								...document.querySelectorAll(`[data-player="${draggedCard.dataset.owner}"] img`)
							];
							const filter = current.filter(card => card.dataset.suit === suit);
							if (filter.length == 0) {
								e.target.appendChild(draggedCard);
								draggedCard.setAttribute('draggable', false);
								draggedParent.classList.remove('current-turn');
								cardsPlayed++;
								addCardToRoundData(draggedCard);
								console.dir(draggedCard);
								checkRoundFinish();
							}
						}
					}
				}
			}
		});
	});
}

function dragDrop() {
	console.log('Adding drag and drop to players cards...');
	const dropSpaces = document.querySelectorAll('.container__card-space');
	const draggables = document.querySelectorAll('img.card[draggable="true"]');
	onDragStart(draggables);
	onDragEnd(draggables);
	onDragOver(dropSpaces);
	onDragEnter(dropSpaces);
	onDragLeave(dropSpaces);
	onDrop(dropSpaces);
}
