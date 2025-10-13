function drawUI() {
	push();
	strokeWeight(2);
	stroke(0);
	fill(255);
	rect(1660, 0, 100, 50);
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

		// push();
		// for (let i = 0; i < 3; i++) {
		// 	if ((i = selectedHotbarSlot)) {
		// 		fill("#ffffff40");
		// 	} else {
		// 		fill("#ffffff20");
		// 	}
		// 	stroke("#ffffff80");
		// 	strokeWeight(5);
		// 	rect(1200 + i * 100, 800, 75, 75);
		// }
		// pop();
	}
}
