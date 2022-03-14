const G = 0.05;
const P = 10;
const COLLAPSE_LENGTH = 0.001;
const canvas = new Canvas();

let particles = [];

for (let i = 0; i < 300; i++) {
	particles.push(
		new Particle({
			x: getRandomBetween(0, canvas.view.width),
			y: getRandomBetween(0, canvas.view.height),
			mass: getRandomBetween(-50 * (canvas.view.width / canvas.view.height), 200 * (canvas.view.width / canvas.view.height)),
		})
	);
}
const centerX = canvas.view.width / 2;
const centerY = canvas.view.height / 2;

canvas.add(...particles);

document.body.append(canvas.view);

requestAnimationFrame(tick);

function tick() {
	requestAnimationFrame(tick);

	for (const particle of particles) {
		particle.forces = [];
	}

	for (let i = 0; i < particles.length - 1; i++) {
		const ctrlParticle = particles[i];

		for (let j = i + 1; j < particles.length; j++) {
			const currentParticle = particles[j];

			const force = Vector.getDiff(
				ctrlParticle.position,
				currentParticle.position
			);

			const forceNumber =
				(G * ctrlParticle.mass * currentParticle.mass) /
				Math.max(force.length ** 2, 0.00001);

			force.mult(forceNumber);

			ctrlParticle.forces.push(force.getNegative());
			currentParticle.forces.push(force);
		}
	}

	for (const particle of particles) {
		const force = particle.force;

		particle.acceleration = new Vector(
			force.x / particle.mass,
			force.y / particle.mass
		);
	}

	for (const particle of particles) {
		particle.speed.add(particle.acceleration);
		particle.position.add(particle.speed);
	}

	const newParticles = [];
	const forDelete = [];

	for (let i = 0; i < particles.length - 1; i++) {
		const a = particles[i];

		if (forDelete.includes(a)) {
			continue;
		}

		for (let j = i + 1; j < particles.length; j++) {
			const b = particles[j];

			if (forDelete.includes(b)) {
				continue;
			}

			const diff = Vector.getDiff(a.position, b.position);

			if (diff.length < (a.r + b.r) / 2) {
				const mass = a.mass + b.mass;

				const newParticle = new Particle({ mass });
				newParticle.position = new Vector(
					b.position.x + (diff.x * a.mass) / newParticle.mass,
					b.position.y + (diff.y * a.mass) / newParticle.mass
				);
				newParticle.speed = new Vector(
					(a.mass / newParticle.mass) * a.speed.x +
					(b.mass / newParticle.mass) * b.speed.x,
					(a.mass / newParticle.mass) * a.speed.y +
					(b.mass / newParticle.mass) * b.speed.y
				);

				newParticles.push(newParticle);
				forDelete.push(a, b);
			}
		}
	}

	const updateParticles = [];
	for (const particle of particles) {
		if (!forDelete.includes(particle)) {
			updateParticles.push(particle);
		}
	}

	updateParticles.push(...newParticles);
	particles = updateParticles;
	canvas.container = particles;
	//canvas.clear();


	canvas.draw();
}
