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

	assaultRifleImage = loadImage("assets/Guns/assaultRifle.png");
	shotgunImage = loadImage("assets/Guns/shotgun.png");
	sniperRifleImage = loadImage("assets/Guns/sniper.png");
	smgImage = loadImage("assets/Guns/smg.png");
	pistolImage = loadImage("assets/Guns/pistol.png");

	rifleAmmoImage = loadImage("assets/Bullets/RifleAmmoSmall.png");
	shotgunAmmoImage = loadImage("assets/Bullets/ShotgunShellSmall.png");
	smgAmmoImage = loadImage("assets/Bullets/PistolAmmoSmall.png");

	tileset = loadImage("assets/environment/tileset.png");

	rifleShot = loadSound("assets/Sounds/762x54r Single Isolated MP3.mp3");
	rifleReload = loadSound("assets/Sounds/ak-47-reload-sound-effect.wav");
}

function setup() {
	inMatch = true;
	createCanvas(windowWidth, windowHeight);
	rectMode(CORNER);
	ellipseMode(CENTER);
	imageMode(CENTER);

	noSmooth();
	arenaAssetsLoad();

	weapons = loadWeapons();
	player.weapon = weapons.assaultRifle;
}

function draw() {
	// arenaAssetsLoad();
	frameRate(60);
	time = Date.now(); // gets the current time (used for calldowns)
	background(0);
	if (inMatch) {
		drawArena(); // Draw the arena
		bulletDraw(); // Draw bullets
		drawPlayer(); // Draw the player

		shooting(); // Handle shooting logic

		createArena(); // used for making new arenas

		drawOpponent();
		drawPlayerUI();
		drawUI(); // Draw the user interface
	}
}

function mouseMoved() {
	socket.emit("mouse_moved", { mX: mouseX, mY: mouseY });
}

function mouseWheel(event) {
	if (inMatch) {
		swapHotBarItem(event.delta);
	}
}
