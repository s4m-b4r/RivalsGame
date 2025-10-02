let bullets = [];
let bulletCooldown = Date.now(); // Cooldown for shooting bullets

class Bullet {
	constructor(x, y, mouseX, mouseY) { //bulletType, weaponRecoil
		this.location = createVector(x, y);
		// recoil calculation
		this.mouseVec = createVector(mouseX, mouseY)
		this.recoildist = this.mouseVec.dist(this.location)
		console.log(this.recoildist)

		this.radius = 10; // Bullet size
		this.speed = 5;
		this.velocity = createVector(x - mouseX, y - mouseY) // direction
			.normalize() // Calculate velocity based on mouse position
			.mult(-this.speed);
	}

	update() {
		this.location.add(this.velocity); // Update bullet position based on velocity
	}

	draw() {
		push();
		translate(this.location.x, this.location.y);
		rotate(this.velocity.heading()); // Rotate bullet to face direction of movement
		// point(this.location.x, this.location.y); // Draw the bullet
		image(rifleAmmo, 0, 0, 40, 40); // Draw the bullet image
		pop();
	}

	isColliding() {
		for (let i = 0; i < 33; i++) {
			for (let j = 0; j < 19; j++) {
				if (arena[j][i] === 1 || arena[j][i] === 2) {
					if (collidePointRect(this.location.x, this.location.y, i * 50, j * 50, 50, 50)) {
						return true;
					}
				}
			}
		}

		return this.location.x < 0 || this.location.x > width || this.location.y < 0 || this.location.y > height; // Check if bullet is off screen
	}
}

function shooting() {
	if (player.magazine > 0 && !reloading) {
		if (mouseIsPressed && mouseButton === LEFT) {
			if (bulletCooldown + 100 <= time) {
				// Check if enough time has passed since last bullet
				let bullet = new Bullet(player.x, player.y, mouseX, mouseY);
				bullets.push(bullet);
				bulletCooldown = time; // Reset cooldown
				rifleShot.setVolume(1);
				rifleShot.play();
				player.magazine--;
			}
		}
	}
}

function bulletDraw() {
	for (let i = bullets.length - 1; i >= 0; i--) {
		let b = bullets[i];
		b.update(); // Update bullet position
		b.draw(); // Draw the bullet

		if (b.isColliding()) {
			bullets.splice(i, 1); // Remove bullet if it goes off screen
		}
	}
}

