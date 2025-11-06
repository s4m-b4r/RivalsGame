socket.on("player_move", (data) => {
	console.log("Opponent moved:", data);
	opponent.x = data.x;
	opponent.y = data.y;
});

socket.on("mouse_moved", (data) => {
	console.log("mouse_moved", data);
	opponent.mouseX = data.mX;
	opponent.mouseY = data.mY;
});

socket.on("bullet_shot", (data) => {
	console.log("bullet_shot", data);
	let bullet = new OpponentBullet(data.l, data.v, data.t);
	bullets.push(bullet);
	rifleShot.setVolume(settings.sfxLevel * settings.masterLevel);
	rifleShot.play();
});

socket.on("equip_item", (data) => {
	console.log("equip_item", data);
	opponent.equipped = data.item;
});

socket.on("damage_dealt", (data) => {
	console.log("damage_dealt", data);
	player.health -= data.d;
	if (player.health <= 0) {
		player.alive = false;
		player.health = 0;
	}
});

socket.on("game_start", (data) => {
	roomID = data.room;
	player.x = data.startPos.x;
	player.y = data.startPos.y;
	opponent.x = data.opStartPos.x;
	opponent.y = data.opStartPos.y;

	console.log("roomID:", roomID, "players:", data.playerId, data.opponentId);

	inMatch = true;
	matchStart = false;
	countdown = true;
	countdownStart = Date.now();
	document.body.classList.toggle("hide-mouse", true);
});

function preload() {
	// Load any assets here if needed //
	// logo //
	logoImage = loadImage("assets/logo/Rivals logo_x100.png");
	// guns //
	assaultRifleImage = loadImage("assets/Guns/assaultRifle.png"); //itemcode 001
	shotgunImage = loadImage("assets/Guns/shotgun.png"); //itemcode 002
	sniperRifleImage = loadImage("assets/Guns/sniper.png"); //itemcode 003
	smgImage = loadImage("assets/Guns/smg.png"); //itemcode 004
	pistolImage = loadImage("assets/Guns/pistol.png"); //itemcode 005
	// bullets //
	rifleAmmoImage = loadImage("assets/Bullets/RifleAmmoSmall.png"); //bullet type 1
	shotgunAmmoImage = loadImage("assets/Bullets/ShotgunShellSmall.png"); // bullet type 2
	smgAmmoImage = loadImage("assets/Bullets/PistolAmmoSmall.png"); // bullet type 3
	// particles //
	dmgParticleImage = loadImage("assets/Particles/dmgParticle.png");
	// tileset //
	tileset = loadImage("assets/environment/tileset.png");
	//sounds//
	clickSound = loadSound("assets/Sounds/Click_stereo.ogg.mp3");
	//weapon sounds//
	rifleShot = loadSound("assets/Sounds/762x54r Single Isolated MP3.mp3");
	rifleReload = loadSound("assets/Sounds/ak-47-reload-sound-effect.wav");
	hitSound = loadSound("assets/Sounds/hitmarker.mp3");

	// grenades //
	handGrenadeImage = loadImage("assets/Grenades/handGrenade.png");
	handGrenadeExplosionImage = loadImage("assets/Grenades/handGrenadeExplosion.png");
}

function setup() {
	inMatch = false;
	createArenaMode = false;
	countdown = false;
	matchStart = false;
	document.body.classList.toggle("hide-mouse", false);

	createCanvas(windowWidth, windowHeight);
	rectMode(CORNER);
	ellipseMode(CENTER);
	imageMode(CENTER);

	noSmooth();
	arenaAssetsLoad();

	weapons = loadWeapons();
	grenadeItems = loadGrenades();
	player.inventory = [weapons.assaultRifle, weapons.pistol, grenadeItems.handGrenade];
	player.weapon = weapons.assaultRifle;
	opponent.weapon = weapons.assaultRifle;
}

function draw() {
	frameRate(60);
	time = Date.now(); // gets the current time (used for calldowns)
	background(0);
	if (inMatch) {
		drawArena(); // Draw the arena
		bulletDraw(); // Draw bullets
		drawPlayer(); // Draw the player

		drawOpponent();
		drawParticles();
		drawPlayerUI();
		drawUI(); // Draw the user interface
	}

	if (createArenaMode) {
		createArena(); // used for making new arenas
		arenaAssetsLoad();
	}

	if (!inMatch) {
		drawMainMenu();
	}

	if (countdown) {
		drawCountdown();
	}
}

function mouseMoved() {
	if (inMatch) {
		socket.emit("mouse_moved", { room: roomID, mX: mouseX, mY: mouseY });
	}
}

function mouseWheel(event) {
	if (inMatch) {
		player.swapHotBarItem(event.delta);
	}
}
