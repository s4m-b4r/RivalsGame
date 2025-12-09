socket.on("player_move", (data) => {
	// console.log("Opponent moved:", data);
	opponent.x = data.x;
	opponent.y = data.y;
});

socket.on("mouse_moved", (data) => {
	// console.log("mouse_moved", data);
	opponent.mouseX = data.mX;
	opponent.mouseY = data.mY;
});

socket.on("bullet_shot", (data) => {
	// console.log("bullet_shot", data);
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
	screenShake = 2;
	damageFlash = 70;
	if (player.health <= 0) {
		player.alive = false;
		player.health = 0;
	}
});

socket.on("grenade_thrown", (data) => {
	console.log("grenade_thrown", data);
	let grenade = new OpponentGrenade(data.l, data.v, data.t, data.dt);
	grenades.push(grenade);
});

socket.on("new_round", (data) => {
	console.log("new_round", data);
	arena = arenas[data.a];
	arenaAssetsLoad();
	player.x = data.startPos.x;
	player.y = data.startPos.y;
	opponent.x = data.opStartPos.x;
	opponent.y = data.opStartPos.y;
	roundEndTime = data.roundEndTime;
	roundStartTime = data.roundStartTime;
	console.log(roundStartTime, roundEndTime, roundStartTime - Date.now(), Date.now());
	inMatch = true;
	roundStart = false;
	countdown = true;
	player.health = 100;
	opponent.health = 100;
	player.alive = true;
	opponent.alive = true;
	gameround++;
	drawWinner = false;
	emittedRoundEnd = false;

	for (let i = 0; i < 3; i++) {
		player.inventory[i].ammo = player.inventory[i].magazineSize;
	}
	player.stamina = 300;

	for (let i = bullets.length - 1; i >= 0; i--) {
		bullets.splice(i, 1);
	}
	for (let i = grenades.length - 1; i >= 0; i--) {
		grenades.splice(i, 1);
	}
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

socket.on("match_over", (data) => {
	if (inMatch) {
		if (data.winner == player.id) {
			matchWinner = "player";
		} else {
			matchWinner = "opponent";
		}
		drawWinner = false;
		drawMatchWinner = true;
		matchWinScreenTime = Date.now();
		queueing = false;
	}
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
	console.log(roundStartTime, roundEndTime, roundStartTime - Date.now(), Date.now());
	arenaAssetsLoad();
	player.id = data.playerId;
	opponent.id = data.opponentId;
	opponent.name = data.opponentName;

	console.log("roomID:", roomID, "players:", data.playerId, data.opponentId);

	opponent.health = 100;
	opponent.alive = true;
	opponentLoadout = data.loadout;

	createOpponentInventory(opponentLoadout);

	player.health = 100;
	player.alive = true;
	drawWinner = false;
	inMatch = true;
	roundStart = false;
	countdown = true;
	document.body.classList.toggle("hide-mouse", true);
	playerScore = 0;
	opponentScore = 0;
	gameround = 0;

	player.inventory = [
		loadoutSelection[0]?.ref ?? weapons.assaultRifle,
		loadoutSelection[1]?.ref ?? weapons.pistol,
		loadoutSelection[2]?.ref ?? grenadeItems.handGrenade,
	];

	for (let i = 0; i < 3; i++) {
		player.inventory[i].ammo = player.inventory[i].magazineSize;
	}
	player.stamina = 300;
	menuMusic.stop();

	for (let i = bullets.length - 1; i >= 0; i--) {
		bullets.splice(i, 1);
	}
	for (let i = grenades.length - 1; i >= 0; i--) {
		grenades.splice(i, 1);
	}
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
	clickSound = loadSound("assets/Sounds/Click_stereo.ogg.mp3"); // yes
	menuMusic = loadSound("assets/Sounds/Apparel Shop Pokemon Sun _ Moon.mp3"); // yes

	//weapon sounds//
	rifleShot = loadSound("assets/Sounds/762x54r Single Isolated MP3.mp3"); // yes
	rifleReload = loadSound("assets/Sounds/ak-47-reload-sound-effect.wav"); // yes
	rifleShot.playMode("restart");
	rifleReload.playMode("restart");

	sniperShot = loadSound("assets/Sounds/sniper-shot.mp3"); // yes
	sniperReload = loadSound("assets/Sounds/sniper-reload.wav"); // yes
	sniperShot.playMode("restart");
	sniperReload.playMode("restart");

	shotgunShot = loadSound("assets/Sounds/shotgun-shot.mp3"); // yes
	shotgunReload = loadSound("assets/Sounds/shotgun-reload.mp3"); // yes
	shotgunShot.playMode("restart");
	shotgunReload.playMode("restart");

	smgShot = loadSound("assets/Sounds/smg-shot.wav"); //yes
	smgReload = loadSound("assets/Sounds/smg-reload.mp3"); //yes
	// smgShot.playMode("restart");
	smgReload.playMode("restart");

	pistolShot = loadSound("assets/Sounds/smg-shot.wav"); //yes
	pistolReload = loadSound("assets/Sounds/smg-reload.mp3"); //yes
	// pistolShot.playMode("restart");
	pistolReload.playMode("restart");

	hitSound = loadSound("assets/Sounds/hitmarker.mp3");
	hitSound.playMode("restart");

	// grenades //
	handGrenadeImage = loadImage("assets/Grenades/handGrenade.png");
	handGrenadeExplosionImage = loadImage("assets/Grenades/handGrenadeExplosion.png");

	grenadeHissing = loadSound("assets/Sounds/grenade-hissing.mp3"); //yes
	grenadeExplosion = loadSound("assets/Sounds/grenade-explosion.ogg"); //yes
}

let masterVolumeSlider;
let sfxVolumeSlider;
let musicVolumeSlider;

function setup() {
	inMatch = false;
	createArenaMode = false;
	countdown = false;
	roundStart = false;
	drawWinner = false;
	drawMatchWinner = false;
	let pauseMenu = false;

	let loggedIn = false;
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

	buildLoadoutItemPool();

	loadoutSelection[0] = allLoadoutItems[0];
	loadoutSelection[1] = allLoadoutItems[1];
	loadoutSelection[2] = allLoadoutItems[5];

	player.inventory = [weapons.assaultRifle, weapons.pistol, grenadeItems.handGrenade];
	opponent.inventory = [weapons.assaultRifle, weapons.pistol, grenadeItems.handGrenade];
}

let screenShake = 0;
let screenShakeDecay = 0.9;
let damageFlash = 0;
let damageFlashDecay = 0.92;

function applyScreenShake() {
	if (screenShake > 0) {
		let shakeX = random(-screenShake, screenShake);
		let shakeY = random(-screenShake, screenShake);
		translate(shakeX, shakeY);
		screenShake *= screenShakeDecay;
		if (screenShake < 0.1) screenShake = 0;
	}
}

function drawDamageFlash() {
	if (damageFlash > 0) {
		push();
		fill(255, 0, 0, damageFlash); // Red with alpha based on damageFlash
		noStroke();
		rect(0, 0, width, height);
		pop();
		damageFlash *= damageFlashDecay;
		if (damageFlash < 1) damageFlash = 0;
	}
}

//fix
function draw() {
	frameRate(60);
	time = Date.now(); // gets the current time (used for calldowns)
	background(0);

	push();
	applyScreenShake();

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
		if (pauseMenu) drawPauseUI();
		if (pauseMenuSettings) {
			drawSettingsMenu();
		}
	}
	pop();

	drawDamageFlash();

	if (createArenaMode) {
		createArena(); // used for making new arenas
		arenaAssetsLoad();
	}

	if (!loggedIn) {
		drawSignInUpScreen();
	} else if (!inMatch) {
		if (selectedMenu == "match") drawMainMenu();
		if (selectedMenu == "settings") {
			drawSettingsMenu();
		}
		if (selectedMenu == "leaderboard") {
			drawLeaderboardMenu();
		}
		if (selectedMenu == "career") {
			drawCareerMenu();
		}
		if (selectedMenu == "loadout") {
			drawLoadoutMenu();
		}
		drawMenuTabs();
		drawWinner = false;
		drawMatchWinner = false;
	}

	if (countdown) {
		drawCountdown();
	}
	if (drawWinner) {
		drawWinRound();
	}
	if (drawMatchWinner) {
		drawWinMatch();
	}
}

function mouseMoved() {
	if (inMatch) {
		socket.emit("mouse_moved", { room: roomID, mX: mouseX, mY: mouseY });
	}
}

function mouseDragged() {
	if (inMatch) {
		socket.emit("mouse_moved", { room: roomID, mX: mouseX, mY: mouseY });
	}
}

function mouseWheel(event) {
	if (inMatch) {
		player.swapHotBarItem(event.delta);
	}
}
