// Drag and Drop
let draggedCard;
let suit;

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

function appendCard(e) {
	let draggedParent = draggedCard.parentElement;
	e.target.appendChild(draggedCard);
	draggedCard.setAttribute('draggable', false);
	draggedParent.classList.remove('current-turn');
	cardsPlayed++;
	addCardToRoundData(draggedCard);
	console.dir(draggedCard);
	checkRoundFinish();
}

function onDrop(dropSpaces) {
	dropSpaces.forEach(space => {
		space.addEventListener('drop', e => {
			e.preventDefault();
			e.target.classList.remove('valid-space');
			let draggedParent = draggedCard.parentElement;
			if (draggedParent.classList.contains('current-turn')) {
				if (e.target.classList.contains('container__card-space') && e.target.childElementCount === 0) {
					const draggedSuit = draggedCard.dataset.suit;
					if (suit === undefined) {
						suit = draggedSuit;
					}
					console.log('suit', suit);

					const allCurrPlayerCards = [
						...document.querySelectorAll(`[data-player="${draggedCard.dataset.owner}"] img`)
					];
					const filterSuit = allCurrPlayerCards.filter(card => card.dataset.suit === suit);

					if (cardsDealt[round] !== 8) {
						const trumpSuit = trumpCard.dataset.suit;
						const filterTrump = allCurrPlayerCards.filter(card => card.dataset.suit === trumpSuit);
						if (draggedSuit === suit) {
							appendCard(e);
						} else if (filterSuit.length === 0 && draggedSuit === trumpSuit) {
							appendCard(e);
						} else if (filterSuit.length === 0 && filterTrump.length === 0) {
							appendCard(e);
						}
					}
					if (cardsDealt[round] === 8) {
						if (draggedSuit === suit) {
							appendCard(e);
						} else if (filterSuit.length === 0) {
							appendCard(e);
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
