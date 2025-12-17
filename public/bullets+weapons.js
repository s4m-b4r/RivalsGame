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
		this.recoilAdd = createVector(random(-this.recoilScale, this.recoilScale), random(-this.recoilScale, this.recoilScale)).mult(this.recoilDist / 100);

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
		for (let i = 0; i < 35; i++) {
			for (let j = 0; j < 19; j++) {
				if (arena[j][i] === 1 || arena[j][i] === 2) {
					if (collidePointRect(this.location.x, this.location.y, i * 50, j * 50, 50, 50)) {
						//check if bullet collides with wall
						return true;
					}
				}
			}
		}
		if (opponent.alive) {
			//checks if bullet collides with opponent
			if (collidePointCircle(this.location.x, this.location.y, opponent.x, opponent.y, player.radius)) {
				opponent.health -= this.damage;
				socket.emit("damage_dealt", { room: roomID, d: this.damage });
				hitSound.setVolume(0.8 * settings.sfxLevel * settings.masterLevel);
				hitSound.play();
				damageParticle(this.location, this.velocity);
				if (opponent.health <= 0 && player.alive) {
					//kills opponent if their health less than 0, tells server
					socket.emit("player_killed_opponent", { room: roomID });
					opponent.alive = false;
				}
				return true;
			}
		}
		return this.location.x < 0 || this.location.x > width || this.location.y < 0 || this.location.y > height; // Check if bullet is off screen
	}
}

//called in main draw() function, not to collide
// with mouseclicked function check if mouse is held, easier
function shooting() {
	if (mouseIsPressed && mouseButton === LEFT && !pauseMenu) {
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
	for (let i = grenades.length - 1; i >= 0; i--) {
		let g = grenades[i];
		g.update();
		g.draw();
		g.checkCollisionDetonation();
		if (g.fullyDetonated) {
			grenades.splice(i, 1); //remove grenade after it has detonated
		}
	}
}

class Weapon {
	constructor(name, asset, bulletAsset, damage, recoil, magazineSize, speed, cooldown, bulletCount, type, refNum, reloadTime, muzzleOffset, shotSound, reloadSound) {
		this.name = name;
		this.asset = asset;
		//for bullet class
		this.bulletAsset = bulletAsset;
		this.damage = damage;
		this.recoil = recoil;
		this.scale = 5;
		this.speed = speed;

		this.magazineSize = magazineSize;
		this.ammo = magazineSize; // Current ammo in magazine
		this.cooldown = cooldown;
		//drawing waepon
		this.x = 0;
		this.y = 0;
		this.visible = true;

		this.bulletCount = bulletCount;
		this.lastShotTime = 0;
		this.type = type; //for server bullet asset transmission
		this.refNum = refNum; // for loadout purposes
		this.shotSound = shotSound;
		this.reloadSound = reloadSound;
		this.remainingAmmo = 10000; // Total ammo available
		this.reloadTime = reloadTime; //time in milliseconds to reload
		this.isReloading = false;
		this.muzzleOffset = muzzleOffset; // distance from player center to weapon muzzle
	}

	shoot() {
		let now = Date.now();
		if (!(now - this.lastShotTime < this.cooldown || this.ammo <= 0 || this.isReloading)) {
			if (this.bulletCount < 2) {
				// cooldown check
				let angle = atan2(mouseY - player.y, mouseX - player.x);

				//shoots bullet from muzzle
				let startX = player.x + cos(angle) * this.muzzleOffset;
				let startY = player.y + sin(angle) * this.muzzleOffset;

				let targetX = startX + cos(angle) * 2000;
				let targetY = startY + sin(angle) * 2000;

				let bullet = new Bullet(startX, startY, targetX, targetY, this);
				bullets.push(bullet); //create new bullet and adds to array
			} else {
				//for shotgun
				let baseAngle = atan2(mouseY - player.y, mouseX - player.x);

				for (let i = 0; i < this.bulletCount; i++) {
					let t = i / (this.bulletCount - 1) - 0.5;
					let angle = baseAngle + t * 0.2467; //0.25 = spread of arc

					//shoots from muzzle
					let startX = player.x + cos(angle) * this.muzzleOffset;
					let startY = player.y + sin(angle) * this.muzzleOffset;

					let targetX = startX + cos(angle) * 2000;
					let targetY = startY + sin(angle) * 2000;

					//creates new bullet
					let bullet = new Bullet(startX, startY, targetX, targetY, this);
					bullets.push(bullet);
				}
			}
			this.lastShotTime = now; // for cooldown
			this.ammo--;

			this.shotSound.setVolume(settings.sfxLevel * settings.masterLevel); //plays shot sound
			this.shotSound.play();
		}
	}

	reload() {
		if (keyIsDown(keybind.reload)) {
			// already reloading/no ammo/full magazine check
			if (!(this.isReloading || this.remainingAmmo <= 0 || this.ammo === this.magazineSize)) {
				this.isReloading = true;
				this.reloadStartTime = Date.now();
				this.reloadSound.setVolume(settings.sfxLevel * settings.masterLevel);
				this.reloadSound.play();
			}
		}

		if (this.isReloading) {
			//calculate ammo for reload and checks player has enough remaining ammo ->
			// to refill a whole mag and if they dont it only reloads part of a mag

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
		// draws the weapon
		if (this.visible) {
			//rotate the weapon around the player instead of rotating in the center
			let angle = atan2(mouseY - player.y, mouseX - player.x);
			this.x = player.x + cos(angle) * 35;
			this.y = player.y + sin(angle) * 35;
			push();
			translate(this.x, this.y);
			rotate(angle);
			//flips the gun after it passes halfway
			if (angle > 1.5 || angle < -1.5) {
				scale(1, -1);
			}

			noSmooth();
			image(this.asset, 0, 0, this.asset.width * 2, this.asset.height * 2);
			pop();
		}
	}
}

//weapons and all their different stats
//loaded after images becfause of errors
function loadWeapons() {
	//name, asset, bulletAsset, damage, recoil, magazineSize, speed, cooldown, bulletCount, type, refNum, reloadTime, muzzleOffset, shotSound, reloadSound
	let assaultRifle = new Weapon("Assault Rifle", assaultRifleImage, rifleAmmoImage, 10, 3, 30, 15, 75, 1, 1, 0, 2000, 60, rifleShot, rifleReload);
	let shotgun = new Weapon("Shotgun", shotgunImage, shotgunAmmoImage, 15, 0, 2, 15, 1000, 7, 2, 1, 2500, 50, shotgunShot, shotgunReload);
	let sniperRifle = new Weapon("Sniper Rifle", sniperRifleImage, rifleAmmoImage, 90, 0, 3, 20, 2000, 1, 1, 2, 3000, 70, sniperShot, sniperReload);
	let smg = new Weapon("SMG", smgImage, smgAmmoImage, 5, 12, 60, 15, 50, 1, 3, 3, 1000, 50, smgShot, smgReload);
	let pistol = new Weapon("Pistol", pistolImage, smgAmmoImage, 15, 3, 12, 15, 125, 1, 3, 4, 500, 40, pistolShot, pistolReload);

	return { assaultRifle, shotgun, sniperRifle, smg, pistol }; //creates an object that holds all the weapons
}

//bullets received from the servers
class OpponentBullet {
	constructor(location, velocity, type) {
		this.location = createVector(location.x, location.y);
		this.velocity = createVector(velocity.x, velocity.y);
		this.type = type;
		this.asset = null;

		//recieves image code so that the whole image isnt shown to the player
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

		opponent.inventory[opponentSelectedSlot].shotSound.setVolume(0.8 * settings.sfxLevel * settings.masterLevel);
		opponent.inventory[opponentSelectedSlot].shotSound.play();
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
		//checks if bullet hits the wall
		for (let i = 0; i < 33; i++) {
			for (let j = 0; j < 19; j++) {
				if (arena[j][i] === 1 || arena[j][i] === 2) {
					if (collidePointRect(this.location.x, this.location.y, i * 50, j * 50, 50, 50)) {
						return true;
					}
				}
			}
		}

		if (player.alive) {
			//if bullet hits the player show the damage particle, sound and remove the bullet
			if (collidePointCircle(this.location.x, this.location.y, player.x, player.y, player.radius)) {
				damageParticle(this.location, this.velocity);
				hitSound.setVolume(0.4 * settings.sfxLevel * settings.masterLevel);
				hitSound.play();
				return true;
			}
		}

		return this.location.x < 0 || this.location.x > width || this.location.y < 0 || this.location.y > height; // Check if bullet is off screen
	}
}

let grenades = [];

//item shown before being thrown
class GrenadeItem {
	constructor(name, asset, eAsset, type, damage, time, count) {
		this.name = name;
		this.asset = asset;
		this.explosionAsset = eAsset;
		this.damage = damage;
		this.type = type; //for server

		this.detonationTime = time;
		this.lastThrownTime = 0;

		this.ammo = count;
		this.magazineSize = count;
		this.speed = 7; //speed it moves
		this.visible = true;
		this.cooldown = 4000; //time to throw next one
		this.refNum = 5; //server reference number
	}
	//use same naming from weapon class to simplify logic elsewhere
	shoot() {
		let now = Date.now();
		if (now - this.lastThrownTime < this.cooldown || this.ammo <= 0) {
			//check cooldown and ammo
			return;
		} else {
			let grenade = new Grenade(this, player.x, player.y, mouseX, mouseY);
			this.lastThrownTime = now;
			grenades.push(grenade);
			//throw the grenade.
			this.ammo--;
			if (this.ammo <= 0) this.visible = false;
		}
	}
	reload() {
		// fill to fix logic elsewhere (do nothing here)
	}
	draw() {
		//draws the grenade being held by the player (same as weapon draw function)
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
		if (this.ammo > 0) this.visible = true;
	}
}

//grenade after being thrown
class Grenade {
	constructor(grenade, x, y, mouseX, mouseY) {
		this.grenade = grenade;
		// similar logic to bullet
		this.location = createVector(x, y);
		this.velocity = createVector(mouseX - x, mouseY - y)
			.normalize()
			.mult(this.grenade.speed); //fix speed on angles

		this.spin = 0; //spin for asset

		//checks for when grenade should detonate
		this.thrownTime = Date.now();
		this.detonated = false;
		this.fullyDetonated = false;
		this.detonationTime = this.thrownTime + this.grenade.detonationTime;

		this.frameCount = 0; // for explosion
		this.detonatedTime = 0;
		//number of assets
		this.lifetime = 30;

		grenadeHissing.setVolume(settings.sfxLevel * settings.masterLevel);
		grenadeHissing.play();
		//send to oppononentt
		socket.emit("grenade_thrown", { room: roomID, l: this.location, v: this.velocity, t: this.grenade.type, dt: this.detonationTime });
	}

	//move grenade
	update() {
		if (!this.detonated) {
			this.location.add(this.velocity);
		}
	}

	draw() {
		let now = Date.now();
		if (this.detonated) {
			//draw explosion
			push();
			translate(this.location.x, this.location.y);
			noSmooth();
			image(this.grenade.explosionAsset, 0, 0, 300, 300, this.frameCount * 355, 0, 355, 355);
			pop();

			if (Date.now() - this.detonatedTime > this.frameCount * 30) {
				this.frameCount++;
			}
		} else {
			//draw grenade
			push();
			translate(this.location.x, this.location.y);
			rotate(this.spin * Math.PI);
			this.spin += 0.02;
			noSmooth();
			image(this.grenade.asset, 0, 0, this.grenade.asset.width * 2, this.grenade.asset.height * 2);
			pop();
		}
	}

	checkCollisionDetonation() {
		if (!this.detonated) {
			// check if greande should detonate
			if (Date.now() > this.detonationTime) {
				this.detonated = true;
				this.detonatedTime = Date.now();
				screenShake = 20;
				grenadeExplosion.setVolume(settings.sfxLevel * settings.masterLevel);
				grenadeExplosion.play();
				//check collision with opponent
				if (collideCircleCircle(this.location.x, this.location.y, 300, opponent.x, opponent.y, opponent.radius)) {
					opponent.health -= this.grenade.damage;
					socket.emit("damage_dealt", { room: roomID, d: this.grenade.damage });
					hitSound.setVolume(0.8 * settings.sfxLevel * settings.masterLevel);
					hitSound.play();
					if (opponent.health <= 0 && player.alive) {
						socket.emit("player_killed_opponent", { room: roomID });
						opponent.alive = false;
					}
				}
				return;
			}

			// check collisions with walls
			for (let i = 0; i < 35; i++) {
				for (let j = 0; j < 19; j++) {
					if (arena[j][i] === 1 || arena[j][i] === 2) {
						let wallX = i * 50;
						let wallY = j * 50;

						if (collidePointRect(this.location.x, this.location.y, wallX, wallY, 50, 50)) {
							let prevPos = p5.Vector.sub(this.location, this.velocity);
							let normal = createVector(0, 0);
							// hit from left or right
							if (prevPos.x < wallX && this.location.x >= wallX) normal = createVector(-1, 0); // left face
							else if (prevPos.x > wallX + 50 && this.location.x <= wallX + 50) normal = createVector(1, 0); // right face
							// hit from top or bottom
							else if (prevPos.y < wallY && this.location.y >= wallY) normal = createVector(0, -1); // top
							else if (prevPos.y > wallY + 50 && this.location.y <= wallY + 50) normal = createVector(0, 1); // bottom

							this.location = prevPos.copy();
							this.velocity.reflect(normal);
							this.velocity.mult(0.6);
						}
					}
				}
			}
		} else if (this.frameCount > this.lifetime) {
			this.fullyDetonated = true; //removes explosion asset from screen
		}
	}
}

//logic for when receiving a grenade across the server
class OpponentGrenade {
	constructor(location, velocity, type, detonationTime) {
		this.type = type;
		this.location = createVector(location.x, location.y);
		this.velocity = createVector(velocity.x, velocity.y);
		this.detonationTime = detonationTime;
		this.detonated = false;
		this.frameCount = 0;
		this.startTime = 0;
		this.spin = 0;
		this.lifetime = 30;
		this.fullyDetonated = false;

		grenadeHissing.setVolume(0.8 * settings.sfxLevel * settings.masterLevel);
		grenadeHissing.play();

		//codes for different grenades (placeholder)
		switch (type) {
			case 1:
				this.asset = handGrenadeImage;
				this.explosionAsset = handGrenadeExplosionImage;
				break;
			case 2:
				this.asset = handGrenadeImage;
				this.explosionAsset = handGrenadeExplosionImage;
				break;
			case 3:
				this.asset = handGrenadeImage;
				this.explosionAsset = handGrenadeExplosionImage;
				break;
		}
	}

	update() {
		if (!this.detonated) {
			this.location.add(this.velocity);
		} //move grenade
	}

	draw() {
		let now = Date.now();
		if (this.detonated) {
			//draw explosion
			push();
			translate(this.location.x, this.location.y);
			noSmooth();
			image(this.explosionAsset, 0, 0, 300, 300, this.frameCount * 355, 0, 355, 355);
			pop();

			if (Date.now() - this.detonatedTime > this.frameCount * 30) {
				this.frameCount++;
			}
		} else {
			// draw grenade
			push();
			translate(this.location.x, this.location.y);
			rotate(this.spin * Math.PI);
			this.spin += 0.02;
			noSmooth();
			image(this.asset, 0, 0, this.asset.width * 2, this.asset.height * 2);
			pop();
		}
	}

	checkCollisionDetonation() {
		if (!this.detonated) {
			//chec for detonation
			if (Date.now() > this.detonationTime) {
				this.detonated = true;
				grenadeExplosion.setVolume(0.8 * settings.sfxLevel * settings.masterLevel);
				grenadeExplosion.play();
				screenShake = 20;
				this.detonatedTime = Date.now();
				//cjeck collision with opponent
				if (collideCircleCircle(this.location.x, this.location.y, 150, opponent.x, opponent.y, opponent.radius)) {
					opponent.health -= 70;
					socket.emit("damage_dealt", { room: roomID, d: 70 });
					hitSound.setVolume(0.8 * settings.sfxLevel * settings.masterLevel);
					hitSound.play();
					if (opponent.health <= 0 && player.alive) {
						socket.emit("player_killed_opponent", { room: roomID });
						opponent.alive = false;
					}
				}
				return;
			}

			// check collisions with walls
			for (let i = 0; i < 35; i++) {
				for (let j = 0; j < 19; j++) {
					if (arena[j][i] === 1 || arena[j][i] === 2) {
						let wallX = i * 50;
						let wallY = j * 50;

						if (collidePointRect(this.location.x, this.location.y, wallX, wallY, 50, 50)) {
							let prevPos = p5.Vector.sub(this.location, this.velocity);
							let normal = createVector(0, 0);
							// hit from left or right
							if (prevPos.x < wallX && this.location.x >= wallX) normal = createVector(-1, 0); // left face
							else if (prevPos.x > wallX + 50 && this.location.x <= wallX + 50) normal = createVector(1, 0); // right face
							// hit from top or bottom
							else if (prevPos.y < wallY && this.location.y >= wallY) normal = createVector(0, -1); // top
							else if (prevPos.y > wallY + 50 && this.location.y <= wallY + 50) normal = createVector(0, 1); // bottom

							this.location = prevPos.copy();
							this.velocity.reflect(normal);
							this.velocity.mult(0.6);
						}
					}
				}
			}
		} else if (this.frameCount > this.lifetime) {
			this.fullyDetonated = true;
		}
	}
}

//create grenade object that holds all grenades
function loadGrenades() {
	//name, asset, eAsset, type, damage, time, count
	let handGrenade = new GrenadeItem("Hand Grenade", handGrenadeImage, handGrenadeExplosionImage, 1, 70, 2500, 5);
	return { handGrenade };
}

let allLoadoutItems = [];

//loadout pool for loadout screen
function buildLoadoutItemPool() {
	allLoadoutItems = [];

	// weapons
	for (let key in weapons) {
		allLoadoutItems.push({
			name: weapons[key].name ?? key,
			ref: weapons[key],
			type: "weapon",
			asset: weapons[key].asset,
		});
	}
	//greandes
	for (let key in grenadeItems) {
		allLoadoutItems.push({
			name: grenadeItems[key].name ?? key,
			ref: grenadeItems[key],
			type: "grenade",
			asset: grenadeItems[key].asset,
		});
	}
}

// creates opponent inventory from code recieved
function createOpponentInventory(opponentLoadout) {
	for (let i = 0; i < 3; i++) {
		switch (opponentLoadout[i]) {
			case 0:
				opponent.inventory[i] = weapons.assaultRifle;
				break;
			case 1:
				opponent.inventory[i] = weapons.shotgun;
				break;
			case 2:
				opponent.inventory[i] = weapons.sniperRifle;
				break;
			case 3:
				opponent.inventory[i] = weapons.smg;
				break;
			case 4:
				opponent.inventory[i] = weapons.pistol;
				break;
			case 5:
				opponent.inventory[i] = grenadeItems.handGrenade;
				break;
			default:
				opponent.inventory[i] = weapons.assaultRifle;
				break;
		}
	}
}
