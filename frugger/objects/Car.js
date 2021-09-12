class Car extends GameObject {
	constructor(x, y, dir) {
		super(x, y, dir);
		this.MAX_SPEED = 1;
		this.type = GameUtilities.EnemyType.CAR;
		this.isMoving = true;
		this.tiresAnimationTimer = new Timer(20, true);

		this.updateMovementVector();
		this.tiresAnimationTimer.start();
	}

	update() {
		super.update();
		this.tiresAnimationTimer.update();
	}
}
