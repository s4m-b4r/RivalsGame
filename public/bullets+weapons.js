let bullets = [];
let bulletCooldown = Date.now(); // Cooldown for shooting bullets

class Bullet {
	constructor(x, y, mouseX, mouseY) {
		//bulletType, weaponRecoil
		this.location = createVector(x, y);
		this.mouseVec = createVector(mouseX, mouseY);
		this.recoilScale = 5;

		// recoil calculation
		this.recoilDist = this.mouseVec.dist(this.location);
		this.recoilAdd = createVector(random(-this.recoilScale, this.recoilScale), random(-this.recoilScale, this.recoilScale)).mult(this.recoilDist / 100);

		this.radius = 10; // Bullet size
		this.speed = 5;
		this.velocity = createVector(x - mouseX, y - mouseY) // direction
			.add(this.recoilAdd)
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

class Weapon {
	constructor(name, asset, damage, recoil, magazineSize, speed, cooldown, bulletCount) {
		this.name = name;
		this.asset = asset;
		this.damage = damage;
		this.recoil = recoil;
		this.scale = 5;
		this.speed = speed;
		this.magazineSize = magazineSize;
		this.cooldown = cooldown;
		this.x = 0;
		this.y = 0;
		this.visible = true;
		this.bulletCount = bulletCount;
	}
	draw() {
		if (this.visible) {
			let angle = atan2(mouseY - player.y, mouseX - player.x);
		}
	}
}
function loadWeapons() {
	let assaultRifle = new Weapon("Assault Rifle", assaultRifleImage, 5, 5, 30, 5, 100, 1);
	let shotgun = new Weapon("Shotgun", shotgunImage, 15, 20, 2, 5, 1000, 7);
	let sniperRifle = new Weapon("Sniper Rifle", sniperRifleImage, 90, 0, 3, 15, 2000, 1);
	let smg = new Weapon("SMG", smgImage, 3, 15, 60, 10, 50, 1);
}
