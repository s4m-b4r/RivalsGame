class Player {
	constructor(name, x, y) {
		this.name = name;
		this.id = null;
		this.x = x; // current position X
		this.y = y; // current position Y
		this.nX = x; // used for collisions as new X
		this.nY = y; // used for collisions as new Y
		this.health = 100;
		this.score = 0;
		this.inventory = [null, null, null];
		this.alive = true;

		this.canMoveX = true; // used for collisions
		this.canMoveY = true; // used for collisions
		this.stamina = 200;
		this.staminaCooldown = false;
		this.radius = 40; // radius for collision detection

		//rolling
		this.speed = 0;
		this.isRolling = false;
		this.rollDirection = { x: 0, y: 0 };
		this.startRollTime = 0; // The time at which the roll started to be used for the cooldown
		this.rollDistance = 200;
		this.rollDuration = 150; // ms
		this.rollCooldown = 500; // ms

		this.mouseX = 0;
		this.mouseY = 450;
	}

	swapHotBarItem(scroll) {
		if (scroll > 0) {
			selectedHotbarSlot++;
			if (selectedHotbarSlot > 2) {
				selectedHotbarSlot = 0;
			}
		} else {
			selectedHotbarSlot--;
			if (selectedHotbarSlot < 0) {
				selectedHotbarSlot = 2;
			}
		}
		socket.emit("swap_item", { room: roomID, s: selectedHotbarSlot });
	}

	shoot(mouseX, mouseY) {
		if (this.inventory[selectedHotbarSlot]) {
			this.inventory[selectedHotbarSlot].shoot();
		}
	}

	move(dx, dy) {
		this.canMoveX = true;
		this.canMoveY = true;
		//checking for collisions
		for (let i = 0; i < 35; i++) {
			for (let j = 0; j < 19; j++) {
				if (arena[j][i] === 1) {
					if (collideRectCircle(i * 50, j * 50, 50, 50, this.x + dx * 2, this.y, this.radius)) {
						this.canMoveX = false;
					}

					if (collideRectCircle(i * 50, j * 50, 50, 50, this.x, this.y + dy * 2, this.radius)) {
						this.canMoveY = false;
					}
				}
			}
		}

		//only move if no collision
		if (this.canMoveX) {
			this.x += dx;
		}
		if (this.canMoveY) {
			this.y += dy;
		}

		socket.emit("player_move", { room: roomID, x: this.x, y: this.y });
	}

	startRoll(directionX, directionY) {
		let now = Date.now();

		if (!this.isRolling && now > this.startRollTime + this.rollCooldown && this.stamina >= 50) {
			this.isRolling = true;
			this.startRollTime = now;

			let dir = createVector(directionX, directionY).normalize(); // Normalize to ensure consistent speed
			this.rollDirection.x = dir.x;
			this.rollDirection.y = dir.y;

			this.canMoveXroll = true;
			this.canMoveYroll = true;
			this.stamina -= 50;
		}
	}

	updateRoll() {
		if (this.isRolling) {
			let elapsed = Date.now() - this.startRollTime;

			if (elapsed < this.rollDuration) {
				let t = elapsed / this.rollDuration;
				this.speed = Math.sin(Math.PI * t) * (this.rollDistance / 30); //smooths out the start and end of the roll

				this.nX = this.x + this.rollDirection.x * this.speed * 6; //fixes the speed
				this.nY = this.y + this.rollDirection.y * this.speed * 6;

				this.canMoveXroll = true;
				this.canMoveYroll = true;

				//checking for collisions while rolling
				for (let i = 0; i < 35; i++) {
					for (let j = 0; j < 19; j++) {
						if (arena[j][i] === 1) {
							if (collideRectCircle(i * 50, j * 50, 50, 50, this.nX, this.y, this.radius)) {
								this.canMoveXroll = false;
								console.log("collisionX");
							}

							if (collideRectCircle(i * 50, j * 50, 50, 50, this.x, this.nY, this.radius)) {
								this.canMoveYroll = false;
								console.log("collisionY");
							}
						}
					}
				}

				if (this.canMoveXroll) {
					this.x = this.nX; //only move if no collision
				}
				if (this.canMoveYroll) {
					this.y = this.nY; //only move if no collision
				}
				if (!this.canMoveX && !this.canMoveY) {
					this.isRolling = false;
				}

				socket.emit("player_move", { room: roomID, x: this.x, y: this.y });
			} else {
				this.isRolling = false; // end roll
			}
		}
	}
}

let player = new Player("P1", 200, 450);

let opponent = new Player("P2", 1000, 450);

function drawPlayer() {
	if (player.alive) {
		moveX = 0;
		moveY = 0;
		sprinting = false;
		if (roundStart) {
			if (player.isRolling === false) {
				if (keyIsDown(keybind.up)) {
					//(up, decrease Y)
					moveY--;
				}
				if (keyIsDown(keybind.left)) {
					//(left, X decrease)
					moveX--;
				}
				if (keyIsDown(keybind.right)) {
					//(right, X increase)
					moveX++;
				}
				if (keyIsDown(keybind.down)) {
					//(down, Y increase)
					moveY++;
				}
				// fix diagonal movement speed
				if (moveX !== 0 && moveY !== 0) {
					moveX *= Math.SQRT1_2;
					moveY *= Math.SQRT1_2;
				}

				if (keyIsDown(keybind.sprint) && (moveX !== 0 || moveY !== 0) && player.stamina > 0 && !player.staminaCooldown) {
					moveX *= 1.75; //sprint
					moveY *= 1.75;
					player.stamina -= 1;
					sprinting = true;

					if (player.stamina < 0) {
						player.staminaCooldown = true;
					}
				}

				if (!sprinting) {
					if (player.stamina <= 300) {
						player.stamina += 0.5;
					}
					if (player.staminaCooldown && player.stamina >= 100) {
						player.staminaCooldown = false;
					}
				}

				sprinting = false;

				moveX *= 4; // Adjust speed as needed
				moveY *= 4; // Adjust speed as needed
				if (moveX != 0 || moveY != 0) {
					player.move(moveX, moveY);
				}

				if (keyIsDown(keybind.roll) && (moveX !== 0 || moveY !== 0)) {
					player.startRoll(moveX, moveY);
				}
			}

			player.updateRoll();
			shooting();
		}

		push();
		fill(settings.pColor);
		strokeWeight(2);
		stroke(0);
		ellipse(player.x, player.y, 50); // Draw player as a circle
		textAlign(CENTER, CENTER);
		textSize(15);
		fill(settings.pColor);
		strokeWeight(0);
		text(player.name.slice(0, 20), player.x, player.y + 35);
		pop();

		if (player.inventory[selectedHotbarSlot]) {
			player.inventory[selectedHotbarSlot].draw(player);
			player.inventory[selectedHotbarSlot].reload();
		}

		if (keyIsDown(keybind.slot1)) {
			selectedHotbarSlot = 0;
		}
		if (keyIsDown(keybind.slot2)) {
			selectedHotbarSlot = 1;
		}
		if (keyIsDown(keybind.slot3)) {
			selectedHotbarSlot = 2;
		}
	}
}

opponentSelectedSlot = 0;

function drawOpponent() {
	if (opponent.alive) {
		push();
		fill(settings.oColor);
		strokeWeight(2);
		stroke(0);
		ellipse(opponent.x, opponent.y, 50);
		pop();
		if (opponent.inventory[opponentSelectedSlot]) {
			let angle = atan2(opponent.mouseY - opponent.y, opponent.mouseX - opponent.x);
			gunX = opponent.x + cos(angle) * 35;
			gunY = opponent.y + sin(angle) * 35;
			push();
			translate(gunX, gunY);
			rotate(angle);

			if (angle > 1.5 || angle < -1.5) {
				//flips the image for when gun is facing the opposite direction
				scale(1, -1);
			}

			image(
				opponent.inventory[opponentSelectedSlot].asset,
				0,
				5,
				opponent.inventory[opponentSelectedSlot].asset.width * 2,
				opponent.inventory[opponentSelectedSlot].asset.height * 2
			); // Draw the gun at player's position
			pop();
		}

		push();
		textAlign(CENTER, CENTER);
		textSize(15);
		fill(settings.oColor);
		strokeWeight(0);
		text(opponent.name.slice(0, 20), opponent.x, opponent.y + 35);
		pop();
	}
}
