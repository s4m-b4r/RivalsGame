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

socket.on("swap_item", (data) => {
	console.log("swap_item", data);
	opponentSelectedSlot = data.s;
});

socket.on("damage_dealt", (data) => {
	console.log("damage_dealt", data);
	player.health -= data.d;
	if (player.health <= 0) {
		player.alive = false;
		player.health = 0;
	}
});

socket.on("new_round", (data) => {
	console.log("new_round", data);
	arena = arenas[data.a];
	arenaAssetsLoad();
	player.x = data.startPos.x;
	player.y = data.startPos.y;
	opponent.x = data.opStartPos.x;
	opponent.y = data.opStartPos.y;
	roundStartTime = data.roundStartTime;
	roundEndTime = data.roundEndTime;
	inMatch = true;
	roundStart = false;
	countdown = true;
	player.health = 100;
	opponent.health = 100;
	player.alive = true;
	opponent.alive = true;
	round++;
	drawWinner = false;
	emittedRoundEnd = false;

	for (let i = 0; i < 3; i++) {
		player.inventory[i].ammo = player.inventory[i].magazineSize;
	}
	player.stamina = 300;
});

socket.on("round_end", (data) => {
	if (data.winner == player.id) {
		playerScore++;
		roundWinner = "player";
	} else if (data.winner == opponent.id) {
		roundWinner = "opponent";
		opponentScore++;
	} else {
		roundWinner = "draw";
	}
	drawWinner = true;
	console.log(roundWinner, "player/opponent score:", playerScore, ":", opponentScore);
});

socket.on("game_start", (data) => {
	roomID = data.room;
	player.x = data.startPos.x;
	player.y = data.startPos.y;
	opponent.x = data.opStartPos.x;
	opponent.y = data.opStartPos.y;
	arena = arenas[data.arena];
	roundEndTime = data.roundEndTime;
	roundStartTime = data.roundStartTime;
	arenaAssetsLoad();
	player.id = data.playerId;
	opponent.id = data.opponentId;
	opponent.name = data.opponentName;

	console.log("roomID:", roomID, "players:", data.playerId, data.opponentId);

	inMatch = true;
	roundStart = false;
	countdown = true;
	document.body.classList.toggle("hide-mouse", true);
	playerScore = 0;
	opponentScore = 0;
	round = 0;
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
	roundStart = false;
	drawWinner = false;

	document.body.classList.toggle("hide-mouse", false);

	createCanvas(windowWidth, windowHeight);
	rectMode(CORNER);
	ellipseMode(CENTER);
	imageMode(CENTER);

	noSmooth();

	let arena = arenas[0];
	arenaAssetsLoad();

	weapons = loadWeapons();
	grenadeItems = loadGrenades();
	player.inventory = [weapons.assaultRifle, weapons.pistol, grenadeItems.handGrenade];
	opponent.inventory = [weapons.assaultRifle, weapons.pistol, grenadeItems.handGrenade];
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

		if (roundStart) {
			drawMatchScoreTime();
		}
	}

	if (createArenaMode) {
		createArena(); // used for making new arenas
		arenaAssetsLoad();
	}

	if (!loggedIn) {
		drawSignInUpScreen();
	} else if (!inMatch) {
		drawMainMenu();
		drawMenuTabs();
	}

	if (countdown) {
		drawCountdown();
	}
	if (drawWinner) {
		drawWinRound();
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
