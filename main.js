document.addEventListener('DOMContentLoaded', () => {
	const canvas = document.querySelector('#canvas');
	const ctx = canvas.getContext('2d');

	canvas.width = '600';
	canvas.height = '600';

	ctx.fillStyle = 'rgb(255, 124, 124)';
	ctx.fillRect(100, 100, 100, 100);
})
