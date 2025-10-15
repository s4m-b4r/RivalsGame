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

		// hotbar

		push();
		rectMode(CENTER);

		stroke("#ffffff80");
		strokeWeight(5);
		for (let i = 0; i < 3; i++) {
			if (i === selectedHotbarSlot) {
				fill("#ffffff60");
				rect(1340 + i * 100, 850, 80, 80);
			} else {
				fill("#ffffff20");
				rect(1340 + i * 100, 850, 75, 75);
			}
		}
		pop();
	}
}
