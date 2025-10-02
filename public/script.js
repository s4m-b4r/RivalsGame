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

function preload() {
	// Load any assets here if needed
	ak47 = loadImage("assets/Guns/AK47.png");
	tileset = loadImage("assets/environment/tileset.png");
	rifleAmmo = loadImage("assets/Bullets/RifleAmmoSmall.png");
	rifleShot = loadSound("assets/Sounds/762x54r Single Isolated MP3.mp3");
	rifleReload = loadSound("assets/Sounds/ak-47-reload-sound-effect.wav");
}

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
	frameRate(120);
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
