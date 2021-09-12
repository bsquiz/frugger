class Tile {
	constructor(type, row, col, animationFrames = 1) {
		this.type = type;
		this.row = row;
		this.col = col;
		this.animationFrames = animationFrames;
		this.isAnimated = false;
		this.currentFrame = 1;
		this.isFirstDraw = true;

		if (this.animationFrames > 1) {
			this.isAnimated = true;
			this.animationTimer = new Timer(this.animationFrames, true, 30);
			this.animationTimer.start();
		}
	}
	update() {
		if (this.isAnimated) {
			this.animationTimer.update();
		}
	}
}
