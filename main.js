const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');

canvas.width = 620;
canvas.height = innerHeight * .95;

let camera = {x: 0, y: 0, angle: 0};

const star = [];
const nbStars = 800;

let lstBullets = [];
let sndBullets = [];

// Create space
class Star {
	constructor(x, y, radius) {
		this.x = x;
		this.y = y;
		this.radius = radius;
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.arc(this.x, this.y + camera.y, this.radius, 0, 2 * Math.PI);
		ctx.fillStyle = '#fff';
		ctx.fill();
	}
}

for (let i = 0; i < nbStars; i++) {
	const newStar = new Star (
		Math.random() * canvas.width,
		Math.random() * canvas.height,
		Math.random() * (1.5 + .2) + .2
	)
	star.push(newStar);
}

class Bullet {
	constructor (x, y) {
		this.x = x;
		this.y = y;
		this.speed = 500;
	}

	drawBullet(ctx, decX) {
		ctx.beginPath();
		ctx.arc(this.x + decX, this.y, 3, 0, 2 * Math.PI);
		ctx.fillStyle = "red";
		ctx.fill();
	}
}

// Create spaceShip
class SpaceShip {
	constructor (imgSrc) {
		this.img = new Image();
		this.img.src = imgSrc;
		this.width = 0;
		this.height = 0;

		this.x = 0;
		this.y = 0;

		this.vx = 0;
		this.vy = 0;
		
		this.speed = 0;
		this.acceleration = 0;
		this.friction = 0;
		this.speedMax = 0;
		this.speedMin = 0;
	}

	addBullet(x, y) {
		lstBullets.push(new Bullet(x, y));
		sndBullets.push(new Audio('/sounds/blaster.wav'));
	}
	
	draw(ctx) {
		if (this.width && this.height) {
			ctx.fillStyle = "red"
			ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
		}
	};
}

document.addEventListener('DOMContentLoaded', () => {
	const player = new SpaceShip('/images/space-ship.png');

	player.img.onload = () => {
		player.width = player.img.width;
		player.height = player.img.height;
		player.x = (canvas.width - player.width) / 2;
		player.y = canvas.height - player.height * 1.5;
	}
	
	player.acceleration = 40;
	player.friction = 20;
	player.speedMax = 300;

	const keys = {
		q: false,
		d: false,
		space: false
	}

	let isPressed = false;

	document.addEventListener('keydown', (k) => {
		switch (k.key) {
			case 'q':
				keys.q = true;
				break;
			case 'd':
				keys.d = true;
				break;
			case ' ':
				if (!keys.space) {
					keys.space = true;
					isPressed = true;
					player.addBullet(player.x, player.y);
				}
				break;
			default:
		}
	})

	document.addEventListener('keyup', (k) => {
		switch (k.key) {
			case 'q':
				keys.q = false;
				break;
			case 'd':
				keys.d = false;
				break;
			case ' ':
				keys.space = false;
				isPressed = false;
				break;
			default:
		}
	})

	// Game Loop
	let lastTime = 0;

	function gameLoop(timestamp) {
		const deltaTime = timestamp - lastTime;
		lastTime = timestamp;

		const dt = deltaTime / 1000;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		if (keys.q) {
			player.vx = Math.max(- player.speedMax, player.vx -= player.acceleration);
		} else {
			if (player.vx < 0) {
				player.vx = Math.min(player.speedMin, player.vx += player.friction);
			}
		}

		if (keys.d) {
			player.vx = Math.min(player.speedMax, player.vx += player.acceleration);
		} else {
			if (player.vx > 0) {
				player.vx = Math.max(player.speedMin, player.vx -= player.friction);
			}
		}

		if (player.x > canvas.width) {
			player.x = - player.width;
		} else if (player.x < - player.width) {
			player.x = canvas.width;
		}

		player.x += player.vx * dt;
		camera.y += 200 * dt;

		star.map((s) => {
			if (s.y + camera.y > canvas.height) {
				s.x = Math.random() * canvas.width;
				s.y = Math.random() * 5 - camera.y;
			} else if (s.y + camera.y < 0) {
				s.x = Math.random() * canvas.width;
				s.y = canvas.height - camera.y;
			}
			s.draw(ctx);
		})

		lstBullets = lstBullets.filter(b => b.y > 0);

		lstBullets.map((b) => {
			b.y -= b.speed * dt;
		})

		sndBullets.map((b) => {
			const index = sndBullets.indexOf(b);
			if (index !== -1) {
				sndBullets.splice(index, 1);
			}
			b.play();
		})

		lstBullets.forEach((bullet) => {
		 	bullet.drawBullet(ctx, player.width/2);
		})
		
		player.draw(ctx);

		requestAnimationFrame(gameLoop);
	}

	requestAnimationFrame(gameLoop);
});
