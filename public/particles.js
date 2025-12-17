let particles = [];

class Particle {
	constructor(x, y, rx, ry, type, asset, frameCount) {
		//position and rotation
		this.x = x;
		this.y = y;
		this.rotation = createVector(rx, ry);

		this.type = type;
		this.lifetime = 30; // frames
		this.frameCount = 0;
		this.startTime = Date.now();
		this.speed = 10;
		this.asset = asset;
	}

	//draws the particle
	draw() {
		push();
		//rotate based on information given
		translate(this.x, this.y);
		rotate(this.rotation.heading() - 0.5 * Math.PI);
		noSmooth();
		image(this.asset, 0, 0, 64, 64, this.frameCount * 64, 0, 64, 64);
		pop();
		// increase the asset frame
		if (this.startTime + (this.frameCount * 50 + 50) > Date.now()) {
			this.frameCount++;
		}
	}
}

function damageParticle(location, velocity) {
	//creates damage particle when opponent shot
	let dmgParticle = new Particle(location.x, location.y, velocity.x, velocity.y, "damage", dmgParticleImage, 30);
	particles.push(dmgParticle);
}

//draws all particles on the screen
function drawParticles() {
	for (let i = particles.length - 1; i >= 0; i--) {
		let p = particles[i];
		p.draw();
		if (p.frameCount >= p.lifetime) {
			particles.splice(i, 1); //removes particles after animation finished
		}
	}
}
