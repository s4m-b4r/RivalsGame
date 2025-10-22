let bullets = [];
let bulletCooldown = Date.now(); // Cooldown for shooting bullets

class Bullet {
	constructor(x, y, mouseX, mouseY, weapon) {
		//bulletType, weaponRecoil
		this.weapon = weapon;
		this.location = createVector(x, y);
		this.mouseVec = createVector(mouseX, mouseY);
		this.recoilScale = weapon.recoil; // Adjust recoil scale based on weapon
		this.damage = weapon.damage;
		this.asset = weapon.bulletAsset;
		this.type = weapon.type;
		// recoil calculation
		this.recoilDist = this.mouseVec.dist(this.location);
		this.recoilAdd = createVector(random(-this.recoilScale, this.recoilScale), random(-this.recoilScale, this.recoilScale)).mult(
			this.recoilDist / 100
		);

		this.radius = 10; // Bullet size
		this.speed = weapon.speed; // Bullet speed
		this.velocity = createVector(x - mouseX, y - mouseY) // direction
			.add(this.recoilAdd)
			.normalize() // Calculate velocity based on mouse position
			.mult(-this.speed);

		socket.emit("bullet_shot", { room: roomID, l: this.location, v: this.velocity, t: this.type });
	}

	update() {
		this.location.add(this.velocity); // Update bullet position based on velocity
	}

	draw() {
		push();
		translate(this.location.x, this.location.y);
		rotate(this.velocity.heading()); // Rotate bullet to face direction of movement
		// point(this.location.x, this.location.y); // Draw the bullet
		image(this.asset, 0, 0, 40, 40); // Draw the bullet image
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
		if (collidePointCircle(this.location.x, this.location.y, opponent.x, opponent.y, player.radius + 5)) {
			opponent.health -= this.damage;
			socket.emit("damage_dealt", { room: roomID, d: this.damage });
			return true;
		}
		return this.location.x < 0 || this.location.x > width || this.location.y < 0 || this.location.y > height; // Check if bullet is off screen
	}
}

function shooting() {
	if (mouseIsPressed && mouseButton === LEFT) {
		player.shoot(mouseX, mouseY);
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
	constructor(name, asset, bulletAsset, damage, recoil, magazineSize, speed, cooldown, bulletCount, type) {
		this.name = name;
		this.asset = asset;
		this.bulletAsset = bulletAsset;
		this.damage = damage;
		this.recoil = recoil;
		this.scale = 5;
		this.speed = speed;
		this.magazineSize = magazineSize;
		this.ammo = magazineSize; // Current ammo in magazine
		this.cooldown = cooldown;
		this.x = 0;
		this.y = 0;
		this.visible = true;
		this.bulletCount = bulletCount;
		this.lastShotTime = 0;
		this.type = type;

		this.remainingAmmo = 90; // Total ammo available
		this.reloadTime = 2000; //time in milliseconds to reload
		this.isReloading = false;
		this.muzzleOffset = 60; // distance from player center to weapon muzzle
	}

	shoot() {
		let now = Date.now();
		if (now - this.lastShotTime < this.cooldown) return; // cooldown check
		if (this.ammo <= 0 || this.isReloading) return; // no ammo check

		for (let i = 0; i < this.bulletCount; i++) {
			let angle = atan2(mouseY - player.y, mouseX - player.x);

			let startX = player.x + cos(angle) * this.muzzleOffset;
			let startY = player.y + sin(angle) * this.muzzleOffset;

			let aimDir = createVector(mouseX - player.x, mouseY - player.y);
			if (aimDir.mag() < this.muzzleOffset) {
				aimDir.setMag(this.muzzleOffset);
				aimDir.add(createVector(player.x, player.y));
			}

			let bullet = new Bullet(startX, startY, aimDir.x, aimDir.y, this);
			bullets.push(bullet);
		}

		this.lastShotTime = now;
		this.ammo--;

		rifleShot.setVolume(settings.sfxLevel * settings.masterLevel);
		rifleShot.play();
	}

	reload() {
		if (keyIsDown(keybind.reload)) {
			// already reloading/no ammo/full magazine check
			if (!(this.isReloading || this.remainingAmmo <= 0 || this.ammo === this.magazineSize)) {
				this.isReloading = true;
				this.reloadStartTime = Date.now();
				rifleReload.setVolume(settings.sfxLevel * settings.masterLevel);
				rifleReload.play();
			}
		}

		if (this.isReloading) {
			if (Date.now() - this.reloadStartTime >= this.reloadTime) {
				let neededAmmo = this.magazineSize - this.ammo;
				let ammoToLoad = min(neededAmmo, this.remainingAmmo);
				this.ammo += ammoToLoad;
				this.remainingAmmo -= ammoToLoad;
				this.isReloading = false;
			}
		}
	}

	draw(player) {
		if (this.visible) {
			let angle = atan2(mouseY - player.y, mouseX - player.x);
			this.x = player.x + cos(angle) * 35;
			this.y = player.y + sin(angle) * 35;
			push();
			translate(this.x, this.y);
			rotate(angle);

			if (angle > 1.5 || angle < -1.5) {
				scale(1, -1);
			}

			noSmooth();
			image(this.asset, 0, 0, this.asset.width * 2, this.asset.height * 2);
			pop();
		}
	}
}

function loadWeapons() {
	let assaultRifle = new Weapon("Assault Rifle", assaultRifleImage, rifleAmmoImage, 5, 5, 30, 10, 75, 1, 1);
	let shotgun = new Weapon("Shotgun", shotgunImage, shotgunAmmoImage, 15, 20, 2, 7, 1000, 7, 2);
	let sniperRifle = new Weapon("Sniper Rifle", sniperRifleImage, rifleAmmoImage, 90, 0, 3, 15, 2000, 1, 1);
	let smg = new Weapon("SMG", smgImage, smgAmmoImage, 3, 15, 60, 15, 50, 1, 3);
	let pistol = new Weapon("Pistol", pistolImage, smgAmmoImage, 20, 3, 12, 10, 125, 1, 3);

	return { assaultRifle, shotgun, sniperRifle, smg, pistol };
}

class OpponentBullet {
	constructor(location, velocity, type) {
		this.location = createVector(location.x, location.y);
		this.velocity = createVector(velocity.x, velocity.y);
		this.type = type;
		this.asset = null;

		switch (type) {
			case 1:
				this.asset = rifleAmmoImage;
				break;
			case 2:
				this.asset = shotgunAmmoImage;
				break;
			case 3:
				this.asset = smgAmmoImage;
				break;
		}
	}

	draw() {
		push();
		translate(this.location.x, this.location.y);
		rotate(this.velocity.heading()); // Rotate bullet to face direction of movement
		// point(this.location.x, this.location.y); // Draw the bullet
		image(this.asset, 0, 0, 40, 40); // Draw the bullet image
		pop();
	}

	update() {
		this.location.add(this.velocity); // Update bullet position based on velocity
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
		if (collidePointCircle(this.location.x, this.location.y, player.x, player.y, player.radius + 5)) {
			return true;
		}

		return this.location.x < 0 || this.location.x > width || this.location.y < 0 || this.location.y > height; // Check if bullet is off screen
	}
}
