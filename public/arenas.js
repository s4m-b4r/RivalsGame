function drawArena() {
	for (let i = 0; i < 19; i++) {
		for (let j = 0; j < 35; j++) {
			noSmooth();
			// tileset, x position, y position, width, height, source x, source y, source width, source height
			image(tileset, j * 50 + 25, i * 50 + 25, 50, 50, 16 * arenaTiles[i][j].x, 16 * arenaTiles[i][j].y, 16, 16);
			// rect(j*50, i *50, 50,50) //grid
		}
	}
}

function switchArena(arenaNumber) {
	if (arenaNumber === 1) {
		arena = ARENA1;
	} else if (arenaNumber === 2) {
		arena = ARENA2;
	} else if (arenaNumber === 3) {
		arena = ARENA3;
	} else if (arenaNumber === 4) {
		arena = ARENA4;
	}
	arenaAssetsLoad();
}

function createArena() {
	let boardX = floor(mouseX / 50);
	let boardY = floor(mouseY / 50);
	if (keyIsDown(48) || keyIsDown(50)) {
		ARENA1[boardY][boardX] = 0;
	}
	if (keyIsDown(49)) {
		ARENA1[boardY][boardX] = 1;
	}
}

function arenaAssetsLoad() {
	// Initialize arenaTiles grid
	for (let i = 0; i < 19; i++) {
		arenaTiles[i] = [];
		for (let j = 0; j < 35; j++) {
			arenaTiles[i][j] = { x: 3, y: 0 }; // default placeholder
		}
	}

	for (let i = 0; i < 19; i++) {
		for (let j = 0; j < 35; j++) {
			const tile = arena[i][j];
			let up, down, left, right;

			// // Left (same row, previous column)
			// if (j === 0) left = true;
			// else left = arena[i][j - 1] !== 0;

			// // Right (same row, next column)
			// if (j === 34) right = true;
			// else right = arena[i][j + 1] !== 0;

			// // Up (previous row, same column)
			// if (i === 0) up = true;
			// else up = arena[i - 1][j] !== 0;

			// // Down (next row, same column)
			// if (i === 18) down = true;
			// else down = arena[i + 1][j] !== 0;

			left = j > 0 ? arena[i][j - 1] !== 0 : false;
			right = j < 34 ? arena[i][j + 1] !== 0 : false;
			up = i > 0 ? arena[i - 1][j] !== 0 : false;
			down = i < 18 ? arena[i + 1][j] !== 0 : false;

			// tile graphics
			if (tile === 0) {
				if (!up && !down && !left && !right) {
					arenaTiles[i][j] = { x: 4, y: 4 }; // middle
				} else if (!up && down && !left && !right) {
					arenaTiles[i][j] = { x: 4, y: 5 }; // bottom middle
				} else if (!up && down && left && !right) {
					arenaTiles[i][j] = { x: 3, y: 5 }; // bottom left
				} else if (!up && down && !left && right) {
					arenaTiles[i][j] = { x: 5, y: 5 }; // bottom right
				} else if (!up && !down && left && !right) {
					arenaTiles[i][j] = { x: 3, y: 4 }; // left side
				} else if (!up && !down && !left && right) {
					arenaTiles[i][j] = { x: 5, y: 4 }; // right side
				} else if (up && !down && !left && !right) {
					arenaTiles[i][j] = { x: 4, y: 3 }; // top middle
				} else if (up && !down && left && !right) {
					arenaTiles[i][j] = { x: 3, y: 3 }; // top left
				} else if (up && !down && !left && right) {
					arenaTiles[i][j] = { x: 5, y: 3 }; // top right
				} else if (up && down && !left && !right) {
					arenaTiles[i][j] = { x: 4, y: 2 }; // inbetween horizontal
				} else if (!up && !down && left && right) {
					arenaTiles[i][j] = { x: 3, y: 2 }; // inbetween vertical
				}
			} else {
				if (!up && !down && !left && !right) {
					arenaTiles[i][j] = { x: 3, y: 1 }; // middle
				} else if (!up && down && !left && !right) {
					arenaTiles[i][j] = { x: 1, y: 5 }; // bottom middle
				} else if (!up && down && left && !right) {
					arenaTiles[i][j] = { x: 1, y: 2 }; // bottom left
				} else if (!up && down && !left && right) {
					arenaTiles[i][j] = { x: 2, y: 2 }; // bottom right
				} else if (!up && !down && left && !right) {
					arenaTiles[i][j] = { x: 2, y: 4 }; // left side
				} else if (!up && !down && !left && right) {
					arenaTiles[i][j] = { x: 4, y: 1 }; // right side
				} else if (up && !down && !left && !right) {
					arenaTiles[i][j] = { x: 3, y: 2 }; // top middle
				} else if (up && !down && left && !right) {
					arenaTiles[i][j] = { x: 1, y: 1 }; // top left
				} else if (up && !down && !left && right) {
					arenaTiles[i][j] = { x: 2, y: 1 }; // top right
				} else if (up && down && !left && !right) {
					arenaTiles[i][j] = { x: 3, y: 3 }; // inbetween horizontal
				} else if (!up && !down && left && right) {
					arenaTiles[i][j] = { x: 2, y: 3 }; // inbetween vertical
				}
			}
		}
	}
}
