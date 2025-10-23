let particles = [];

class Particle {
	constructor(x, y, rx, ry, type, asset) {
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

	draw() {
		push();
		translate(this.x, this.y);
		rotate(this.rotation.heading());
		image(this.asset, 0, 0, 16, 16, this.frameCount * 64, 0, 64, 64);
		pop();
		this.frameCount++;
	}
}

function damageParticle(location, velocity) {
	let dmgParticle = new Particle(location.x, location.y, velocity.x, velocity.y, "damage", dmgParticleImage);
	particles.push(dmgParticle);
	console.log("particle spawn");
}

function drawParticles() {
	for (let i = particles.length - 1; i >= 0; i--) {
		let p = particles[i];
		p.draw();
		if ((p.frameCount = p.lifetime)) {
			particles.splice(i, 1);
			console.log("particle gone");
		}
	}
}
