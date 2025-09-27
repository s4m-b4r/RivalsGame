function drawUI() {
	push();
	strokeWeight(2);
	stroke(0);
	fill(255);
	rect(1660, 0, 100, 50);
	pop();
}

function drawCrosshair() {
	push();
	stroke("#f5c536");
	strokeWeight(3);
	noFill();
	line(mouseX + 7, mouseY, mouseX + 15, mouseY);
	line(mouseX - 7, mouseY, mouseX - 15, mouseY); //crosshair
	line(mouseX, mouseY - 7, mouseX, mouseY - 15);
	line(mouseX, mouseY + 7, mouseX, mouseY + 15);
	ellipse(mouseX, mouseY, 20);
	point(mouseX, mouseY);
	pop();

	push();
	textSize(25);
	stroke("#f5c53621");
	fill(245, 197, 54);
	text(player.magazine, mouseX + 25, mouseY + 8);
	fill(245, 197, 54, 125);
	textSize(15);
	text(player.ammo, mouseX + 55, mouseY - 8);
	pop();
}
