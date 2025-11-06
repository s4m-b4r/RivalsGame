function drawUI() {
	push();

	pop();
}

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
		if (player.weapon) {
			push();
			textSize(25);
			stroke("#f5c53621");
			fill(245, 197, 54);
			text(player.weapon.ammo, mouseX + 25, mouseY + 8);
			fill(245, 197, 54, 125);
			textSize(15);
			text(player.weapon.remainingAmmo, mouseX + 55, mouseY - 8);
			pop();
		}
		//health + stamina bar
		push();
		rectMode(CORNER);
		stroke("#00000080");
		strokeWeight(2);
		fill("#ff000040");
		rect(60, 770, 285, 30);
		fill("#00ff0040");
		rect(60, 770, 285 * (player.health / 100), 30);
		fill("#ffffff80");
		textAlign(CENTER, CENTER);
		textSize(20);
		strokeWeight(1);
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
	image(logoImage, 0, 0, height, height);
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
	if (!inMatch) {
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
let lastSecondPlayed = -1;
function drawCountdown() {
	if (Date.now() < countdownStart + 4000) {
		push();
		stroke(0);
		fill("#00000050");
		rect(0, 0, width, height);
		i = Math.trunc((Date.now() - countdownStart) / 1000);
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
		text(countdownArray[i], 1700 / 2, 950 / 2);
		pop();
	} else {
		lastSecondPlayed = -1;
		matchStart = true;
		countdown = false;
	}
}
