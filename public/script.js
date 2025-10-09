socket.on("player_move", (data) => {
	console.log("Opponent moved:", data);
	opponent.x = data.x;
	opponent.y = data.y;
});

socket.on("bullet_shot", (data) => {
	console.log("Bullet shot:", data);
});

socket.on("mouse_moved", (data) => {
	console.log("mouse_moved", data);
	opponent.mouseX = data.mX;
	opponent.mouseY = data.mY;
});

socket.on("bullet_shot", (data) => {
	console.log("bullet_shot", data);
});

function setup() {
	createCanvas(windowWidth, windowHeight);
	rectMode(CORNER);
	ellipseMode(CENTER);
	imageMode(CENTER);
	translate(0, windowHeight - 30);
	noSmooth();
	arenaAssetsLoad();
}

function draw() {
	// arenaAssetsLoad();
	frameRate(60);
	time = Date.now(); // gets the current time (used for calldowns)
	background(0);
	drawArena(); // Draw the arena
	bulletDraw(); // Draw bullets
	drawPlayer(); // Draw the player
	drawGun(); // Draw the gun
	shooting(); // Handle shooting logic

	createArena();

	drawOpponent();
	drawPlayerUI();
	drawUI(); // Draw the user interface
}

function mouseMoved() {
	socket.emit("mouse_moved", { mX: mouseX, mY: mouseY });
}
