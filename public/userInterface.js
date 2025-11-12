selectedHotbarSlot = 0;

function drawPlayerUI() {
	if (inMatch) {
		//crosshair
		push();
		stroke("#f5c536");
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
			stroke("#f5c53621");
			fill(245, 197, 54);
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
			strokeWeight(1);
			textAlign(CENTER, CENTER);
			text(player.inventory[i].ammo, 124 + i * 100, 875);
			pop();
		}
		pop();
	}
}

let queueing = false;

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

function mouseClicked() {
	if (loggedIn && !inMatch) {
		if (collidePointRect(mouseX, mouseY, width - 450, height - 250, 400, 200)) {
			if (!queueing) {
				socket.emit("join_queue");
				queueing = true;
			} else {
				socket.emit("leave_queue");
				queueing = false;
			}
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

roundStartTime = 0;
roundEndTime = 0;
function drawMatchScoreTime() {
	let remainingRoundTime = roundEndTime - Date.now();

	if (remainingRoundTime < 0) remainingRoundTime = 0;

	let roundMinutes = floor(remainingRoundTime / 60000);
	let roundSeconds = floor((remainingRoundTime % 60000) / 1000);
	let roundTimeStr = nf(roundMinutes, 2) + ":" + nf(roundSeconds, 2);
	console.log(roundTimeStr);
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
	}
	pop();
}

roundWinner = "";
function drawWinRound() {
	if (roundWinner == "player") {
		push();
		textAlign(CENTER, CENTER);
		textFont("IMPACT");
		stroke("#0000ff");
		fill("#0000ff");
		strokeWeight(0);
		textSize(100);
		text(`${player.name} WON THE ROUND!`, 1750 / 2, 950 / 2);
		pop();
	} else if (roundWinner == "opponent") {
		push();
		textAlign(CENTER, CENTER);
		textFont("IMPACT");
		stroke("#ff0000");
		fill("#ff0000");
		strokeWeight(0);
		textSize(100);
		text(`${opponent.name} WON THE ROUND!`, 1750 / 2, 950 / 2);
		pop();
	}
	console.log("win screen");
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
		player.username = usernameInput;
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

		message = "Welcome, " + usernameInput + "!";
	}
}

async function savePlayerSettings() {
	await fetch("/save_settings", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			username: player.username,
			keybinds: keybind,
			settings: settings,
		}),
	});
}
