// opponent moving
socket.on("player_move", (data) => {
	// console.log("Opponent moved:", data);
	opponent.x = data.x;
	opponent.y = data.y;
});

//opponent aiming gun
socket.on("mouse_moved", (data) => {
	// console.log("mouse_moved", data);
	opponent.mouseX = data.mX;
	opponent.mouseY = data.mY;
});

//opponet shoots bullet
socket.on("bullet_shot", (data) => {
	// console.log("bullet_shot", data);
	let bullet = new OpponentBullet(data.l, data.v, data.t);
	bullets.push(bullet);
	rifleShot.setVolume(settings.sfxLevel * settings.masterLevel);
	rifleShot.play();
});

//opponent swaps item
socket.on("swap_item", (data) => {
	console.log("swap_item", data);
	opponentSelectedSlot = data.s;
});

//receiving damage
socket.on("damage_dealt", (data) => {
	console.log("damage_dealt", data);
	player.health -= data.d;
	screenShake = (data.d / 50) * 1;
	damageFlash = (data.d / 100) * 200;
	if (player.health <= 0) {
		player.alive = false;
		player.health = 0;
	}
});

//opponent throws grenade
socket.on("grenade_thrown", (data) => {
	console.log("grenade_thrown", data);
	let grenade = new OpponentGrenade(data.l, data.v, data.t, Date.now() + 2500);
	grenades.push(grenade);
});

//server starts new round
socket.on("new_round", (data) => {
	console.log("new_round", data);
	//new arena and map
	arena = arenas[data.a];
	arenaAssetsLoad();

	//player information
	player.x = data.startPos.x;
	player.y = data.startPos.y;
	opponent.x = data.opStartPos.x;
	opponent.y = data.opStartPos.y;

	// countdown and match end time
	roundEndTime = Date.now() + 155000;
	roundStartTime = Date.now() + 1000;
	console.log(roundStartTime, roundEndTime, roundStartTime - Date.now(), Date.now());
	inMatch = true;
	roundStart = false;
	countdown = true;

	//reset health
	player.health = 100;
	opponent.health = 100;
	player.alive = true;
	opponent.alive = true;

	//fix variables
	gameround++;
	drawWinner = false;
	emittedRoundEnd = false;

	//reload weapons
	for (let i = 0; i < 3; i++) {
		player.inventory[i].ammo = player.inventory[i].magazineSize;
	}
	// reset stamina
	player.stamina = 300;

	//delete bullets and grenades from map
	for (let i = bullets.length - 1; i >= 0; i--) {
		bullets.splice(i, 1);
	}
	for (let i = grenades.length - 1; i >= 0; i--) {
		grenades.splice(i, 1);
	}
});

//when a round ends
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

//when a match ends
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
		clearUI(); //fixes settings showing
	}
});

socket.on("game_start", (data) => {
	//room code used for all communication
	roomID = data.room;
	// positions
	player.x = data.startPos.x;
	player.y = data.startPos.y;
	opponent.x = data.opStartPos.x;
	opponent.y = data.opStartPos.y;
	//arena
	arena = arenas[data.arena];
	arenaAssetsLoad();

	//timings
	roundEndTime = Date.now() + 155000;
	roundStartTime = Date.now() + 1000;
	console.log(roundStartTime, roundEndTime, roundStartTime - Date.now(), Date.now());

	// names and ids
	player.id = data.playerId;
	opponent.id = data.opponentId;
	opponent.name = data.opponentName;

	console.log("roomID:", roomID, "players:", data.playerId, data.opponentId);

	//resets
	opponent.health = 100;
	opponent.alive = true;
	opponentLoadout = data.loadout;

	createOpponentInventory(opponentLoadout); //create opponent loadout

	//resets
	player.health = 100;
	player.alive = true;
	drawWinner = false;

	//start match and countdown
	inMatch = true;
	roundStart = false;
	countdown = true;
	document.body.classList.toggle("hide-mouse", true);

	//resets
	playerScore = 0;
	opponentScore = 0;
	gameround = 0;

	//create player inventory
	player.inventory = [loadoutSelection[0]?.ref ?? weapons.assaultRifle, loadoutSelection[1]?.ref ?? weapons.pistol, loadoutSelection[2]?.ref ?? grenadeItems.handGrenade];

	//resets ammos
	for (let i = 0; i < 3; i++) {
		player.inventory[i].ammo = player.inventory[i].magazineSize;
	}
	player.stamina = 300;

	//stop menu music
	menuMusic.stop();

	//deletes bullets/grenades
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

	//restart fixes clipping and audio distortion over time (simple fix)
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

//volumes
let masterVolumeSlider;
let sfxVolumeSlider;
let musicVolumeSlider;

function setup() {
	//set menu variables
	inMatch = false;
	createArenaMode = false;
	countdown = false;
	roundStart = false;
	drawWinner = false;
	drawMatchWinner = false;
	pauseMenu = false;

	loggedIn = false;
	document.body.classList.toggle("hide-mouse", false);

	//create canvas, set modes
	createCanvas(windowWidth, windowHeight);
	rectMode(CORNER);
	ellipseMode(CENTER);
	imageMode(CENTER);

	noSmooth(); //removes image smoothing

	//load an empty arena for logic
	let arena = arenas[0];
	arenaAssetsLoad();

	//load item objects
	weapons = loadWeapons();
	grenadeItems = loadGrenades();

	//load and create default loadout selection
	buildLoadoutItemPool();
	loadoutSelection[0] = allLoadoutItems[0];
	loadoutSelection[1] = allLoadoutItems[1];
	loadoutSelection[2] = allLoadoutItems[5];

	//set loadouts for logic
	player.inventory = [weapons.assaultRifle, weapons.pistol, grenadeItems.handGrenade];
	opponent.inventory = [weapons.assaultRifle, weapons.pistol, grenadeItems.handGrenade];
}

//screenshake and flash values
let screenShake = 0;
let screenShakeDecay = 0.9;
let damageFlash = 0;
let damageFlashDecay = 0.92;

//shakes the screen
function applyScreenShake() {
	if (screenShake > 0) {
		let shakeX = random(-screenShake, screenShake);
		let shakeY = random(-screenShake, screenShake);
		translate(shakeX, shakeY);
		screenShake *= screenShakeDecay;
		if (screenShake < 0.1) screenShake = 0;
	}
}

//flash overlay
function drawDamageFlash() {
	if (damageFlash > 0) {
		push();
		fill(255, 20, 20, damageFlash);
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
	applyScreenShake(); //check for screenshake

	if (inMatch) {
		drawArena(); // Draw the arena
		bulletDraw(); // Draw bullets
		drawPlayer(); // Draw the player

		drawOpponent(); //draw oppoinent
		drawParticles(); //draw particles
		drawPlayerUI(); //draw UI over everythign

		if (roundStart) {
			drawMatchScoreTime(); //score
		}
		if (pauseMenu) drawPauseUI(); //pause overlay
		if (pauseMenuSettings) {
			drawSettingsMenu();
		}
	}
	pop();

	drawDamageFlash(); //damage flash over everything

	if (createArenaMode) {
		createArena(); // used for making new arenas
		arenaAssetsLoad();
	}

	if (!loggedIn) {
		//login screen
		drawSignInUpScreen();
	} else if (!inMatch) {
		//menu screens
		if (selectedMenu == "match") drawMainMenu();
		if (selectedMenu == "settings") {
			drawSettingsMenu();
			pauseMenuSettings = false;
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
		//top tabs
		drawMenuTabs();
		drawWinner = false; //stop overlay from match
		drawMatchWinner = false;
	}

	//countdown in game
	if (countdown) {
		drawCountdown();
	}
	//winner overlays in match
	if (drawWinner) {
		drawWinRound();
	}
	if (drawMatchWinner) {
		drawWinMatch();
	}
}

//checks for moving mouse for server
function mouseMoved() {
	if (inMatch) {
		socket.emit("mouse_moved", { room: roomID, mX: mouseX, mY: mouseY });
	}
}

//fixes mouse movement when shooting
function mouseDragged() {
	if (inMatch) {
		socket.emit("mouse_moved", { room: roomID, mX: mouseX, mY: mouseY });
	}
}

//swaps item
function mouseWheel(event) {
	if (inMatch) {
		player.swapHotBarItem(event.delta);
	}
}
