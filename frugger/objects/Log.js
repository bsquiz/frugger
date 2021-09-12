class Log extends GameObject {
	constructor(x, y, dir) {
		super(x, y, dir);
		this.type = GameUtilities.GameObjectType.LOG;
		this.width = GameUtilities.TILE_WIDTH * 4;
		this.height = GameUtilities.TILE_HEIGHT;
		this.isMoving = true;
	}
	moveBehavior() {
		this.linearMovement();
		this.wrapHorizontally(GameUtilities.COLS * GameUtilities.TILE_WIDTH);
	}
}
