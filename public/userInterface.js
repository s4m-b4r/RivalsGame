selectedHotbarSlot = 0;

pauseMenu = false;
function drawPauseUI() {
	push();
	fill("#20202050");
	strokeWeight(0);
	rectMode(CORNER);
	rect(725, 275, 300, 400, 10);

	textAlign(CENTER, CENTER);
	textFont("IMPACT");
	textSize(30);

	//resume
	fill("#ffffff50");
	if (collidePointRect(mouseX, mouseY, 750, 300, 250, 100)) fill("#ffffff80");
	rect(750, 300, 250, 100, 10);
	fill("#ffffff");
	text("RESUME", 875, 350);
	//settings
	fill("#ffffff50");
	if (collidePointRect(mouseX, mouseY, 750, 425, 250, 100)) fill("#ffffff80");
	rect(750, 425, 250, 100, 10);
	fill("#ffffff");
	text("SETTINGS", 875, 475);
	//forfeit
	fill("#ffffff50");
	if (collidePointRect(mouseX, mouseY, 750, 550, 250, 100)) fill("#ffffff80");
	rect(750, 550, 250, 100, 10);
	fill("#ffffff");
	text("FORFEIT", 875, 600);
	pop();
}

function drawPlayerUI() {
	if (inMatch) {
		//crosshair
		push();
		stroke(settings.cColor);
		strokeWeight(3);
		noFill();
		line(mouseX + 7, mouseY, mouseX + 15, mouseY);
		line(mouseX - 7, mouseY, mouseX - 15, mouseY);
		line(mouseX, mouseY - 7, mouseX, mouseY - 15);
		line(mouseX, mouseY + 7, mouseX, mouseY + 15);
		ellipse(mouseX, mouseY, 20);
		point(mouseX, mouseY);
		pop();

		//magazine count
		if (player.inventory[selectedHotbarSlot]) {
			push();
			textFont("IMPACT");
			textSize(15);
			stroke(settings.cColor);
			fill(settings.cColor);
			strokeWeight(0);
			textAlign(CENTER, CENTER);
			text(player.inventory[selectedHotbarSlot].ammo, mouseX + 25, mouseY);
			pop();
		}
		//health + stamina bar
		push();
		rectMode(CORNER);
		stroke("#00000050");
		strokeWeight(1);
		fill("#ff000040");
		rect(60, 770, 285, 30);
		fill("#00ff0040");
		rect(60, 770, 285 * (player.health / 100), 30);

		fill("#ffffff80");
		textAlign(CENTER, CENTER);
		textSize(20);
		strokeWeight(1);
		textFont("IMPACT");
		text(`${player.health}/100`, 202.5, 784);
		fill("#3065ba20");
		rect(60, 760, 285, 10);
		fill("#3065ba80");
		rect(60, 760, 285 * (player.stamina / 300.5), 10);
		pop();

		// hotbar
		push();
		rectMode(CENTER);

		stroke("#ffffff80");
		strokeWeight(5);
		for (let i = 0; i < 3; i++) {
			if (i === selectedHotbarSlot) {
				fill("#ffffff60");
				rect(100 + i * 100, 850, 80, 80);
				push();
				translate(100 + i * 100, 850);
				rotate(-0.25 * Math.PI);
				image(player.inventory[i].asset, 0, 0, player.inventory[i].asset.width * 2, player.inventory[i].asset.height * 2);
				pop();
			} else {
				fill("#ffffff20");
				rect(100 + i * 100, 850, 75, 75);
				push();
				translate(100 + i * 100, 850);
				rotate(-0.25 * Math.PI);
				image(player.inventory[i].asset, 0, 0, player.inventory[i].asset.width * 1.5, player.inventory[i].asset.height * 1.5);
				pop();
			}
			push();
			stroke("#ffffff90");
			textSize(15);
			fill("#ffffff90");
			strokeWeight(0);
			textAlign(CENTER, CENTER);
			text(player.inventory[i].ammo, 124 + i * 100, 875);
			pop();
		}
		pop();
	}
}

let queueing = false;

let selectedMenu = "match";

function drawMenuTabs() {
	push();
	stroke("#f6cd26");
	rectMode(CORNER);

	strokeWeight(3);
	//Match Menu
	fill("#202020");
	if (collidePointRect(mouseX, mouseY, 41, 41, 300, 75)) fill("#303030");
	if (selectedMenu == "match") fill("#f6cd2650");
	rect(41, 41, 300, 75);

	//loadout menu
	fill("#202020");
	if (collidePointRect(mouseX, mouseY, 423, 41, 300, 75)) fill("#303030");
	if (selectedMenu == "loadout") fill("#f6cd2650");
	rect(423, 41, 300, 75);

	//LeaderBoard Menu
	fill("#202020");
	if (collidePointRect(mouseX, mouseY, 805, 41, 300, 75)) fill("#303030");
	if (selectedMenu == "career") fill("#f6cd2650");
	rect(805, 41, 300, 75);
	//career menu
	fill("#202020");
	if (collidePointRect(mouseX, mouseY, 1187, 41, 300, 75)) fill("#303030");
	if (selectedMenu == "leaderboard") fill("#f6cd2650");
	rect(1187, 41, 300, 75);
	//settings menu
	fill("#202020");
	if (collidePointRect(mouseX, mouseY, 1569, 41, 300, 75)) fill("#303030");
	if (selectedMenu == "settings") fill("#f6cd2650");
	rect(1569, 41, 300, 75);

	//texts
	textAlign(CENTER, CENTER);
	textFont("IMPACT");
	textSize(50);
	strokeWeight(1);
	fill("#f6cd26");
	stroke("#202020");
	text("MATCH", 191, 78);
	text("LOADOUT", 573, 78);
	text("CAREER", 955, 78);
	text("LEADERBOARD", 1337, 78);
	text("SETTINGS", 1719, 78);
	pop();
}

function drawMainMenu() {
	push();
	background("#202020");
	noSmooth();
	// filter(BLUR, 2);
	imageMode(CORNER);
	image(logoImage, 0, 75, height - 75, height - 75);
	rectMode(CENTER);
	stroke("#f6cd26");
	strokeWeight(3);
	fill("#202020");
	if (collidePointRect(mouseX, mouseY, width - 450, height - 250, 400, 200)) {
		fill("#303030");
	}
	rect(width - 250, height - 150, 400, 200);

	textAlign(CENTER, CENTER);

	stroke("#202020");
	strokeWeight(1);
	textFont("IMPACT");
	fill("#f6cd26");
	textSize(50);
	if (queueing) {
		text("QUEUEING", width - 250, height - 150);
	} else {
		text("JOIN GAME", width - 250, height - 150);
	}
	pop();
}

let colorPickerCrosshair, colorPickerOpponent;
let slidersInitialized = false;
let uiElements = [];

function drawSettingsMenu() {
	background("#202020");
	noSmooth();
	drawTextsettings();

	if (!slidersInitialized) {
		createSettingsUI();
		slidersInitialized = true;
	}
}
function drawTextsettings() {
	push();
	for (let i = 0; i < keybindLabels.length; i++) {
		x = keyStartX;
		y = keyStartY + i * keySpacing;
		label = keybindLabels[i][0];

		textAlign(LEFT, CENTER);
		textSize(25);
		textFont("IMPACT");
		fill("#f6cd26");
		strokeWeight(0);
		text(label, x, y + 5);
	}

	//volume
	textAlign(LEFT, CENTER);
	textSize(25);
	textFont("IMPACT");
	fill("#f6cd26");
	strokeWeight(0);
	text("Master Volume", 150, 210);
	text("Music Volume", 150, 310);
	text("SFX Volume", 150, 410);

	text("Crosshair Colour", 150, 520);
	text("Opponent Colour", 350, 520);
	text("Player Colour", 150, 650);
	pop();
}

const keybindLabels = [
	["Move Up", "up"],
	["Move Down", "down"],
	["Move Left", "left"],
	["Move Right", "right"],
	["Roll", "roll"],
	["Sprint", "sprint"],
	["Reload", "reload"],
	["Pause", "pause"],
	["Slot 1", "slot1"],
	["Slot 2", "slot2"],
	["Slot 3", "slot3"],
];
// Keybind inputs
let keyStartX = 800;
let keyStartY = 220;
let keySpacing = 60;

function createSettingsUI() {
	clearUI();

	createVolumeSlider("Master Volume", 150, 220, "masterLevel");
	createVolumeSlider("Music Volume", 150, 320, "musicLevel");
	createVolumeSlider("SFX Volume", 150, 420, "sfxLevel");

	createColorPickerUI("Crosshair Colour", 150, 540, "cColor");
	createColorPickerUI("Opponent Colour", 350, 540, "oColor");
	createColorPickerUI("Player Colour", 150, 670, "pColor");

	keybindLabels.forEach(([label, key], i) => {
		createKeybindInput(label, keyStartX, keyStartY + i * keySpacing, key);
	});

	let saveBtn = createButton("SAVE SETTINGS");
	saveBtn.position(width - 450, height - 120);
	saveBtn.size(400, 80);
	saveBtn.style("font-family", "IMPACT");
	saveBtn.style("font-size", "28px");
	saveBtn.style("background-color", "#f6cd26");
	saveBtn.style("border", "none");
	saveBtn.style("color", "#202020");
	saveBtn.style("border-radius", "10px");
	saveBtn.mousePressed(savePlayerSettingsUI);
	uiElements.push(saveBtn);
}

function clearUI() {
	for (let el of uiElements) el.remove();
	uiElements = [];
}

function createVolumeSlider(label, x, y, settingKey) {
	let slider = createSlider(0, 1, settings[settingKey], 0.01);
	slider.position(x, y);
	slider.style("width", "400px");
	slider.style("height", "30px");
	slider.input(() => (settings[settingKey] = slider.value()));
	uiElements.push(slider);
}

function createColorPickerUI(label, x, y, settingKey) {
	let picker = createColorPicker(settings[settingKey]);
	picker.position(x, y);
	picker.size(80, 80);
	picker.input(() => (settings[settingKey] = picker.value()));

	uiElements.push(picker);
	if (settingKey === "cColor") colorPickerCrosshair = picker;
	else colorPickerOpponent = picker;
}

function createKeybindInput(label, x, y, key) {
	let input = createInput(keyCodeToName(keybind[key]));
	input.position(x + 250, y - 15);
	input.size(180, 40);
	input.style("text-align", "center");
	input.style("background-color", "#202020");
	input.style("border", "3px solid #f6cd26");
	input.style("color", "#fff");
	input.style("font-family", "IMPACT");
	input.style("font-size", "22px");
	input.style("border-radius", "6px");
	input.elt.readOnly = true;

	input.mousePressed(() => {
		input.value("Press key...");
		function captureKey(e) {
			e.preventDefault();
			keybind[key] = e.keyCode;
			input.value(keyCodeToName(e.keyCode));
			window.removeEventListener("keydown", captureKey);
		}
		window.addEventListener("keydown", captureKey);
	});

	uiElements.push(input);
}

function keyCodeToName(code) {
	switch (code) {
		case 32:
			return "Space";
		case 16:
			return "Shift";
		case 27:
			return "Esc";
		case 9:
			return "Tab";
		default:
			return String.fromCharCode(code);
	}
}

async function savePlayerSettingsUI() {
	await fetch("/save_settings", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			username: player.name,
			keybinds: keybind,
			settings: settings,
		}),
	});
	menuMusic.setVolume(0.5 * settings.musicLevel * settings.masterLevel);

	console.log("Settings saved!");
}

function drawLeaderboardMenu() {
	background("#202020");

	leaderboardButtonHovered = collidePointRect(mouseX, mouseY, width / 2 - 150, 200, 300, 70);

	push();
	rectMode(CORNER);
	stroke("#f6cd26");
	strokeWeight(3);
	fill(leaderboardButtonHovered ? "#303030" : "#202020");
	rect(width / 2 - 150, 200, 300, 70, 10);
	fill("#f6cd26");
	textAlign(CENTER, CENTER);
	textSize(32);
	textFont("IMPACT");
	strokeWeight(0);
	text("RANK BY: " + statDisplayName(leaderboardStat), width / 2 - 150 + 300 / 2, 200 + 70 / 2);
	pop();

	push();
	textAlign(CENTER, CENTER);
	textFont("IMPACT");
	fill("#f6cd26");
	textSize(40);
	text("RANK", width / 2 - 300, 300);
	text("PLAYER", width / 2, 300);
	text(statDisplayName(leaderboardStat).toUpperCase(), width / 2 + 300, 300);
	pop();

	push();
	textFont("IMPACT");
	textSize(32);
	textAlign(CENTER, CENTER);

	for (let i = 0; i < leaderboardData.length && i < 10; i++) {
		let y = 360 + i * 60;
		let row = leaderboardData[i];

		fill(i % 2 === 0 ? "#ffffff15" : "#ffffff05");
		rect(width / 2 - 500, y - 25, 1000, 50);

		fill("#ffffff");
		text(i + 1, width / 2 - 300, y);
		text(row.username.slice(0, 25), width / 2, y);
		text(row[leaderboardStat], width / 2 + 300, y);
	}
	pop();
}

let loadoutSelection = [null, null, null];
let selectedLoadoutIndex = 0;

function drawLoadoutMenu() {
	push();
	background("#202020");

	drawLoadoutItemsGrid();
	drawLoadoutSlots();
	pop();
}

function drawLoadoutItemsGrid() {
	push();
	let startX = 120;
	let startY = 200;
	let cardW = 260;
	let cardH = 180;
	let gap = 40;

	for (let i = 0; i < allLoadoutItems.length; i++) {
		let row = Math.floor(i / 2);
		let col = i % 2;

		let itemx = startX + col * (cardW + gap);
		let itemy = startY + row * (cardH + gap);

		drawLoadoutCard(i, allLoadoutItems[i], itemx, itemy, cardW, cardH);
	}
	pop();
}

function drawLoadoutCard(i, item, x, y, w, h) {
	push();
	let hovered = collidePointRect(mouseX, mouseY, x, y, w, h);

	stroke("#f6cd26");
	strokeWeight(hovered ? 6 : 3);
	fill(hovered ? "#303030" : "#202020");
	rect(x, y, w, h, 15);

	if (item.asset) {
		imageMode(CENTER);
		image(item.asset, x + w / 2, y + h / 2 - 10, item.asset.width * 4, item.asset.height * 4);
	}

	noStroke();
	fill("#f6cd26");
	textSize(28);
	textAlign(CENTER, CENTER);
	text(item.name.toUpperCase(), x + w / 2, y + h - 30);
	pop();
}

function drawLoadoutSlots() {
	push();

	for (let i = 0; i < 3; i++) {
		let x = width - 500;
		let y = 250 + i * 200;

		drawLoadoutSlot(i, x, y, 500, 150);
	}

	pop();
}

function drawLoadoutSlot(i, x, y, w, h) {
	push();
	let hovered = collidePointRect(mouseX, mouseY, x, y, w, h);
	let selected = selectedLoadoutIndex === i;

	stroke(selected ? "#f6cd26" : "#ffffff44");
	strokeWeight(selected ? 6 : 3);
	fill(hovered ? "#303030" : "#202020");
	rect(x - 30, y, w, h, 15);

	noStroke();
	fill("#f6cd26");
	textSize(30);
	textAlign(CENTER, CENTER);

	let item = loadoutSelection[i];

	if (item) {
		if (item.asset) {
			imageMode(CENTER);
			image(item.asset, x + 70, y + h / 2, item.asset.width * 4, item.asset.height * 4);
		}
		text(item.name.toUpperCase(), x + w / 2 + 20, y + h / 2);
	} else {
		text("EMPTY", x + w / 2, y + h / 2);
	}
	pop();
}

function drawCareerMenu() {
	background("#202020");

	let kills = player.kills;
	let deaths = player.deaths;
	let wins = player.matchesWon;
	let losses = player.matchesLost;

	let WLtotal = wins + losses;
	let WLangle1 = (wins / WLtotal) * TWO_PI;
	let WLangle2 = (losses / WLtotal) * TWO_PI;

	let KDtotal = kills + deaths;
	let KDangle1 = (kills / KDtotal) * TWO_PI;
	let KDangle2 = (deaths / KDtotal) * TWO_PI;
	push();
	textAlign(LEFT, CENTER);
	translate(width / 2 - 350, 600);

	stroke("#f6cd26");
	strokeWeight(3);
	fill("#ffffff08");
	rectMode(CENTER);
	rect(0, 0, 500, 700, 15);

	noStroke();
	fill("#f6cd26");
	textFont("IMPACT");
	textSize(70);
	text("K/D RATIO", -220, -280);

	let radius = 200;
	let start = -HALF_PI;

	fill("#00ff00AA");
	arc(0, -30, radius * 2, radius * 2, start, start + KDangle1);

	fill("#ff0000AA");
	arc(0, -30, radius * 2, radius * 2, start + KDangle1, start + KDangle1 + KDangle2);

	noStroke();

	textSize(40);
	fill("#00ff00");
	text(`${kills} KILLS`, -220, 255);

	fill("#ff0000");
	text(`${deaths} DEATHS`, -220, 305);

	fill("#ffffff");
	textSize(60);
	let KDratio;
	if (deaths === 0) {
		KDratio = kills;
	} else {
		KDratio = (kills / deaths).toFixed(2);
	}
	textAlign(CENTER, CENTER);
	text(KDratio, 0, -25);
	pop();
	//////////////////////
	push();
	textAlign(LEFT, CENTER);
	translate(width / 2 + 350, 600);

	stroke("#f6cd26");
	strokeWeight(3);
	fill("#ffffff08");
	rectMode(CENTER);
	rect(0, 0, 500, 700, 15);

	noStroke();
	fill("#f6cd26");
	textFont("IMPACT");
	textSize(70);
	text("W/L RATIO", -220, -280);

	fill("#00ff00AA");
	arc(0, -30, radius * 2, radius * 2, start, start + WLangle1);

	fill("#ff0000AA");
	arc(0, -30, radius * 2, radius * 2, start + WLangle1, start + WLangle1 + WLangle2);

	noStroke();

	textSize(40);
	fill("#00ff00");
	text(`${wins} WINS`, -220, 255);

	fill("#ff0000");
	text(`${losses} LOSSES`, -220, 305);

	fill("#ffffff");
	textSize(60);
	let WLratio;
	if (losses === 0) {
		WLratio = wins;
	} else {
		WLratio = (wins / losses).toFixed(2);
	}
	textAlign(CENTER, CENTER);
	text(WLratio, 0, -25);
	pop();
}

function mouseClicked() {
	if (loggedIn && !inMatch) {
		if (selectedMenu === "match") {
			if (collidePointRect(mouseX, mouseY, width - 450, height - 250, 400, 200)) {
				if (!queueing) {
					socket.emit("join_queue", { loadout: [loadoutSelection[0].ref.refNum, loadoutSelection[1].ref.refNum, loadoutSelection[2].ref.refNum] });
					queueing = true;
				} else {
					socket.emit("leave_queue");
					queueing = false;
				}
			}
		}
		//Match Menu
		if (collidePointRect(mouseX, mouseY, 41, 41, 300, 75)) {
			selectedMenu = "match";
			slidersInitialized = false;
			clearUI();
		}

		//loadout menu
		if (collidePointRect(mouseX, mouseY, 423, 41, 300, 75)) {
			selectedMenu = "loadout";
			slidersInitialized = false;
			clearUI();
		}

		//career Menu
		if (collidePointRect(mouseX, mouseY, 805, 41, 300, 75)) {
			selectedMenu = "career";
			slidersInitialized = false;
			clearUI();
		}

		//leaderboard menu
		if (collidePointRect(mouseX, mouseY, 1187, 41, 300, 75)) {
			selectedMenu = "leaderboard";
			slidersInitialized = false;
			clearUI();
			loadLeaderboardData();
		}

		//settings menu
		if (collidePointRect(mouseX, mouseY, 1569, 41, 300, 75)) selectedMenu = "settings";

		if (selectedMenu === "leaderboard") {
			if (collidePointRect(mouseX, mouseY, width / 2 - 150, 200, 300, 70)) {
				// cycle to the next stat
				let index = leaderboardStatsList.indexOf(leaderboardStat);
				leaderboardStat = leaderboardStatsList[(index + 1) % leaderboardStatsList.length];
				loadLeaderboardData();
			}
		}

		if (selectedMenu === "loadout") {
			let startX = 120,
				startY = 200;
			let cardW = 260,
				cardH = 180,
				gap = 40;

			for (let i = 0; i < allLoadoutItems.length; i++) {
				let row = Math.floor(i / 2);
				let col = i % 2;

				let x = startX + col * (cardW + gap);
				let y = startY + row * (cardH + gap);

				if (collidePointRect(mouseX, mouseY, x, y, cardW, cardH)) {
					loadoutSelection[selectedLoadoutIndex] = allLoadoutItems[i];
					return;
				}
			}

			let baseX = width - 500;
			let baseY = 250;

			for (let i = 0; i < 3; i++) {
				let x = baseX;
				let y = baseY + i * 200;

				if (collidePointRect(mouseX, mouseY, x, y, 400, 150)) {
					selectedLoadoutIndex = i;
					return;
				}
			}
		}
	}

	if (inMatch && pauseMenu) {
		//resume
		if (collidePointRect(mouseX, mouseY, 750, 300, 250, 100)) {
			pauseMenu = false;
			document.body.classList.toggle("hide-mouse", true);
		}
		//settings
		if (collidePointRect(mouseX, mouseY, 750, 425, 250, 100)) {
			pauseMenu = false;
			document.body.classList.toggle("hide-mouse", false);
		}
		//forfeit
		if (collidePointRect(mouseX, mouseY, 750, 550, 250, 100)) {
			socket.emit("forfeit_round", { room: roomID });
			pauseMenu = false;
			document.body.classList.toggle("hide-mouse", false);
		}
	}
}

let countdownArray = ["3", "2", "1", "GO!", " "];
roundStartTime = 0;
let lastSecondPlayed = -1;
function drawCountdown() {
	if (Date.now() < roundStartTime + 4000) {
		push();
		stroke(0);
		fill("#00000050");
		rect(0, 0, width, height);
		i = Math.trunc((Date.now() - roundStartTime) / 1000);
		if (i !== lastSecondPlayed && i < countdownArray.length) {
			clickSound.setVolume(settings.masterLevel * settings.sfxLevel);
			clickSound.play();
			lastSecondPlayed = i;
		}

		textAlign(CENTER, CENTER);
		textFont("IMPACT");
		textSize(100);
		strokeWeight(0);
		stroke("#ffffff");
		fill("#ffffff95");
		text(countdownArray[i], 1750 / 2, 950 / 2);
		pop();
	} else {
		lastSecondPlayed = -1;
		roundStart = true;
		countdown = false;
	}
}

emittedRoundEnd = false;
roundStartTime = 0;
roundEndTime = 0;
function drawMatchScoreTime() {
	let remainingRoundTime = roundEndTime - Date.now();

	if (remainingRoundTime < 0) remainingRoundTime = 0;

	let roundMinutes = floor(remainingRoundTime / 60000);
	let roundSeconds = floor((remainingRoundTime % 60000) / 1000);
	let roundTimeStr = nf(roundMinutes, 2) + ":" + nf(roundSeconds, 2);

	push();
	textAlign(CENTER, CENTER);
	textFont("IMPACT");
	stroke("#ffffff98");
	fill("#ffffff");
	strokeWeight(0);
	textSize(25);
	text(roundTimeStr, 875, 25);
	pop();

	//scores
	push();
	textAlign(CENTER, CENTER);
	textFont("IMPACT");
	textSize(25);
	fill("#0000ff");

	text(playerScore, 775, 25);

	fill("#ff0000");
	text(opponentScore, 975, 25);

	if (remainingRoundTime === 0) {
		drawWinner = true;
		if (!emittedRoundEnd) {
			emittedRoundEnd = true;
			if (player.health > opponent.health) {
				socket.emit("player_killed_opponent", { room: roomID });
			} else if (player.health == opponent.health) {
				socket.emit("new_round_equal_health", { room: roomID });
			}
		}
	}
	pop();
}

roundWinner = "";
function drawWinRound() {
	if (roundWinner == "player") {
		push();
		textAlign(CENTER, CENTER);
		textFont("IMPACT");
		stroke(settings.pColor);
		fill(settings.pColor);
		strokeWeight(0);
		textSize(100);
		text(`${player.name.toUpperCase()} WON THE ROUND!`, 1750 / 2, 950 / 2);
		pop();
	} else if (roundWinner == "opponent") {
		push();
		textAlign(CENTER, CENTER);
		textFont("IMPACT");
		stroke(settings.oColor);
		fill(settings.oColor);
		strokeWeight(0);
		textSize(100);
		text(`${opponent.name.toUpperCase()} WON THE ROUND!`, 1750 / 2, 950 / 2);
		pop();
	} else if (roundWinner == "draw") {
		push();
		textAlign(CENTER, CENTER);
		textFont("IMPACT");
		stroke("#ffff00");
		fill("#ffff00");
		strokeWeight(0);
		textSize(100);
		text(`DRAW`, 1750 / 2, 950 / 2);
		pop();
	}
	console.log("win screen");
}

matchWinner = "";
matchWinScreenTime = 0;
function drawWinMatch() {
	if ((matchWinner = "player")) {
		push();
		textAlign(CENTER, CENTER);
		textFont("IMPACT");
		stroke(settings.pColor);
		fill(settings.pColor);
		strokeWeight(0);
		textSize(100);
		text(`${player.name.toUpperCase()} WON THE MATCH!`, 1750 / 2, 950 / 2);
		pop();
	} else {
		push();
		textAlign(CENTER, CENTER);
		textFont("IMPACT");
		stroke(settings.oColor);
		fill(settings.oColor);
		strokeWeight(0);
		textSize(100);
		text(`${opponent.name.toUpperCase()} WON THE MATCH!`, 1750 / 2, 950 / 2);
		pop();
	}
	if (Date.now() > matchWinScreenTime + 5000) {
		drawMatchWinner = false;
		inMatch = false;
		roundStart = false;
		countdown = false;
		document.body.classList.toggle("hide-mouse", false);
	}
}

let loggedIn = false;
let showingSignup = false;
let usernameInput = "";
let passwordInput = "";
let message = "";

function drawSignInUpScreen() {
	push();
	background("#202020");
	imageMode(CORNER);
	image(logoImage, 0, 0, height, height);
	rectMode(CORNER);
	fill("#373737");
	rect(width - 500, 0, 500, height);

	fill("#f6cd26");
	textAlign(CENTER, CENTER);
	textFont("IMPACT");
	textSize(40);
	text(showingSignup ? "SIGN UP" : "SIGN IN", width - 250, 100);

	textSize(20);
	fill("#ffffff");
	textAlign(LEFT, CENTER);
	text("Username:", width - 400, 250);
	text("Password:", width - 400, 350);

	noFill();
	stroke("#f6cd26");
	if (focusedInput === "username") strokeWeight(3);
	else strokeWeight(1);
	rect(width - 400, 270, 300, 40);
	if (focusedInput === "password") strokeWeight(3);
	else strokeWeight(1);
	rect(width - 400, 370, 300, 40);
	strokeWeight(0);
	textSize(20);
	stroke("#ffffff");
	fill("#ffffff");
	text(usernameInput, width - 390, 290);
	text(passwordInput.replace(/./g, "*"), width - 390, 390);
	strokeWeight(1);
	rectMode(CENTER);
	stroke("#f6cd26");
	fill("#202020");
	if (collidePointRect(mouseX, mouseY, width - 350, 450, 200, 60)) fill("#303030");
	rect(width - 250, 480, 200, 60);
	noStroke();
	fill("#f6cd26");
	textAlign(CENTER, CENTER);
	textSize(25);
	text(showingSignup ? "CREATE" : "LOGIN", width - 250, 480);

	textSize(16);
	fill("#bbb");
	textAlign(CENTER);
	text(showingSignup ? "Already have an account? Click here to login" : "No account? Click here to sign up", width - 250, 560);

	fill("#f6cd26");
	textAlign(CENTER);
	text(message, width - 250, 620);
	pop();
}

function keyPressed() {
	if (!loggedIn) {
		if (keyCode === BACKSPACE) {
			if (focusedInput === "username") usernameInput = usernameInput.slice(0, -1);
			if (focusedInput === "password") passwordInput = passwordInput.slice(0, -1);
		} else if (key.length === 1 && key !== " ") {
			if (focusedInput === "username") usernameInput += key;
			if (focusedInput === "password") passwordInput += key;
		}
	}
	if (inMatch) {
		if (keyCode == keybind.pause) {
			if (!pauseMenu) {
				pauseMenu = true;
				document.body.classList.toggle("hide-mouse", false);
			} else {
				pauseMenu = false;
				document.body.classList.toggle("hide-mouse", true);
			}
		}
	}
}

let focusedInput = "username";

function mousePressed() {
	if (!loggedIn) {
		// username box
		if (collidePointRect(mouseX, mouseY, width - 400, 270, 300, 40)) focusedInput = "username";
		// password box
		else if (collidePointRect(mouseX, mouseY, width - 400, 370, 300, 40)) focusedInput = "password";
		// login/signup button
		else if (collidePointRect(mouseX, mouseY, width - 350, 450, 200, 60)) {
			if (showingSignup) handleSignup();
			else handleLogin();
		}
		// toggle link
		else if (collidePointRect(mouseX, mouseY, width - 450, 540, 400, 40)) {
			showingSignup = !showingSignup;
			message = "";
		}
	}
}

async function handleSignup() {
	const res = await fetch("/signup", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ username: usernameInput, password: passwordInput }),
	});
	const data = await res.json();
	message = data.message || data.error || "";
	if (data.success) showingSignup = false;
}

async function handleLogin() {
	const res = await fetch("/login", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ username: usernameInput, password: passwordInput }),
	});
	const data = await res.json();
	message = data.message || data.error || "";
	if (data.success) {
		loggedIn = true;
		player.name = usernameInput;
		socket.emit("register_username", { username: usernameInput });

		// Load settings
		const settingsRes = await fetch("/load_settings", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username: usernameInput }),
		});
		const settingsData = await settingsRes.json();
		if (settingsData.settings) {
			settings = Object.assign(new Settings(), settingsData.settings);
			keybind = Object.assign(new Keybinds(), settingsData.keybinds);
		}

		// Load career stats
		const careerRes = await fetch("/career", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ username: usernameInput }),
		});

		const careerData = await careerRes.json();

		player.kills = careerData.kills;
		player.deaths = careerData.deaths;
		player.roundsWon = careerData.rounds_won;
		player.matchesWon = careerData.matches_won;
		player.matchesLost = careerData.matches_lost;

		menuMusic.setVolume(0.5 * settings.musicLevel * settings.masterLevel);
		menuMusic.loop();
	}
}

let leaderboardData = [];
let leaderboardStat = "matches_won";
let leaderboardStatsList = ["matches_won", "kills", "rounds_won"];
let leaderboardButtonHovered = false;

async function loadLeaderboardData() {
	const res = await fetch("/leaderboard");
	const data = await res.json();
	leaderboardData = data;
}

function statDisplayName(stat) {
	if (stat === "matches_won") return "MATCHES WON";
	if (stat === "kills") return "KILLS";
	if (stat === "rounds_won") return "ROUNDS WON";
	return stat;
}
