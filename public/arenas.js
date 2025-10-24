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

//33 x 19

/*
if [arena[y][x] === 1] && arena[y+1][x] === 0 then tile 2,3,4,5
if [arena[y][x] === 1] && arena[y][x-1] === 0 && arena[y][x+1] === 0 then tile 1,7,13,19

[0][0][0]
[0][1][0]
[0][0][0]
*/

function arenaAssetsLoad() {
	let tempx = 0;
	let tempy = 0;
	for (let i2 = 0; i2 < 20; i2++) {
		arenaTiles[i2] = [];
		for (let j2 = 0; j2 < 36; j2++) {
			arenaTiles[i2][j2] = null; // placeholder
		}
	}

	for (let i2 = 0; i2 < 20; i2++) {
		for (let j2 = 0; j2 < 36; j2++) {
			arenaTiles[i2][j2] = null;
			arenaTiles[i2][j2] = { x: 3, y: 0 };
		}
	}

	for (let i3 = 0; i3 < 19; i3++) {
		for (let j3 = 0; j3 < 35; j3++) {
			tile = arena[i3][j3];
			if (i3 == 0) {
				left = true;
			} else if (arena[i3][j3 - 1] === 0) {
				left = false;
			} else {
				left = true;
			}

			if (i3 == 19) {
				right = true;
			} else if (arena[i3][j3 + 1] === 0) {
				right = false;
			} else {
				right = true;
			}

			if (j3 == 0) {
				up = true;
			} else if (arena[i3 - 1][j3] === 0) {
				up = false;
			} else {
				up = true;
			}

			if (j3 == 35) {
				down = true;
			} else if (arena[i3 + 1][j3] === 0) {
				down = false;
			} else {
				down = true;
			}
			console.log(up, down, left, right);

			if (tile == 0) {
				////////// tile below /////////////// tile above /////////////// tile right ////////////// tile left ///////
				if (!up && !down && !left && !right) {
					arenaTiles[i3][j3] = { x: 4, y: 4 }; //floor middle
				} else if (!up && down && !left && !right) {
					arenaTiles[i3][j3] = { x: 4, y: 5 }; //floor bottom middle
				} else if (!up && down && left && !right) {
					arenaTiles[i3][j3] = { x: 3, y: 5 }; //floor bottom left
				} else if (!up && down && !left && right) {
					arenaTiles[i3][j3] = { x: 5, y: 5 }; //floor bottom right
				} else if (!up && !down && left && !right) {
					arenaTiles[i3][j3] = { x: 3, y: 4 }; //floor left side
				} else if (!up && !down && !left && right) {
					arenaTiles[i3][j3] = { x: 5, y: 4 }; //floor right side
				} else if (up && !down && !left && !right) {
					arenaTiles[i3][j3] = { x: 4, y: 3 }; //floor top middle
				} else if (up && !down && left && !right) {
					arenaTiles[i3][j3] = { x: 3, y: 3 }; //floor top left
				} else if (up && !down && !left && right) {
					arenaTiles[i3][j3] = { x: 5, y: 3 }; //floor top right
				}
			}
			// if (tile === 1) {
			// 	if (arena[i3][j3] && arena[i3][j3] === 0) {
			// 		arenaTiles[i3][j3] = { x: 0, y: 1 }; // wall
			// 	}
			// }
		}
	}
}
