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
		rect(75, 760, 300, 30);
		fill("#00ff0040");
		rect(75, 760, 300 * (player.health / 100), 30);
		fill("#ffffff80");
		textAlign(CENTER, CENTER);
		textSize(20);
		strokeWeight(1);
		text(`${player.health}/100`, 225, 775);
		fill("#3065ba20");
		rect(75, 750, 300, 10);
		fill("#3065ba80");
		rect(75, 750, 300 * (player.stamina / 300.5), 10);
		pop();

		// hotbar
		push();
		rectMode(CENTER);

		stroke("#ffffff80");
		strokeWeight(5);
		for (let i = 0; i < 3; i++) {
			if (i === selectedHotbarSlot) {
				fill("#ffffff60");
				rect(125 + i * 100, 850, 80, 80);
			} else {
				fill("#ffffff20");
				rect(125 + i * 100, 850, 75, 75);
			}
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
