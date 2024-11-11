document.addEventListener('DOMContentLoaded', () => {
	const canvas = document.querySelector('#canvas');
	const ctx = canvas.getContext('2d');

	function resizeCanvas() {
		canvas.width = window.innerWidth * .8;  // Largeur dynamique en fonction de la fenêtre
		canvas.height = window.innerHeight * .8; // Hauteur dynamique en fonction de la fenêtre
	}

	resizeCanvas();

	// Create player
	const spaceShip = {
		img: new Image(),
		src: "/images/space-ship.png",
		x: 0,
		y: 0,
		width: 0,
		height: 0
	}

	spaceShip.img.src = spaceShip.src;

	spaceShip.img.onload = () => {
		spaceShip.width = spaceShip.img.width;
		spaceShip.height = spaceShip.img.height;

		spaceShip.x = (canvas.width - spaceShip.width)/2;
		spaceShip.y = (canvas.height - spaceShip.height)/2;
	}

	// Create stars
	const listStars = [];
	const minRadius = .5;
	const maxRadius = 1.5;
	const nbStars = 500;

	for (let i = 0; i < nbStars; i++) {
		const newStar = {
			x: Math.random() * canvas.width,
			y: Math.random() * canvas.height,
			radius: Math.random() * (maxRadius - minRadius) + minRadius
		}

		listStars.push(newStar);
	}
	
	// Draw stars
	function drawStars() {
		listStars.map((star) => {
			ctx.beginPath();
			ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
			ctx.fillStyle = '#fff';
			ctx.fill();
		})
	}

	// Move stars
	function moveStars() {
		listStars.map((star) => {
			star.y++;
			if (star.y >= canvas.height) {
					star.x = Math.random() * (canvas.width - 0) + 0,
					star.y = 0
			}
		})
	}

	window.addEventListener('resize', () => {
		const oldCanvasWidth = canvas.width;
		const oldCanvasHeight = canvas.Height;

		resizeCanvas();
		spaceShip.x = (canvas.width - spaceShip.width)/2;
		spaceShip.y = (canvas.height - spaceShip.height)/2;
	});

	// Game Loop
	let lastTime = 0;

	function gameLoop(timestamp) {
		const deltaTime = timestamp - lastTime;
		lastTime = timestamp;

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		
		drawStars();
		// moveStars();

		ctx.drawImage(spaceShip.img, spaceShip.x, spaceShip.y, spaceShip.width, spaceShip.height);

		requestAnimationFrame(gameLoop);
	}

	requestAnimationFrame(gameLoop);
})
