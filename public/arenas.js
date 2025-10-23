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
			arenaTiles[i2][j2] = { x: 4, y: 3 };
		}
	}

	for (let i3 = 0; i3 < 19; i3++) {
		for (let j3 = 0; j3 < 35; j3++) {
			tile = arena[i3][j3];

			if (tile === 0) {
				tempx = Math.floor(random(0, 4));
				tempy = Math.floor(random(0, 3));
				arenaTiles[i3][j3] = { x: 6 + tempx, y: 0 + tempy }; // floor
			}

			if (tile === 1) {
				if (arena[i3][j3] && arena[i3][j3] === 0) {
					arenaTiles[i3][j3] = { x: 0, y: 1 }; // wall
				} else {
					tempx = Math.floor(random(0, 4));
					arenaTiles[i3][j3] = { x: 1 + tempx, y: 0 }; // wall
				}
			}
		}
	}
}
