class Player extends GameObject {
	constructor() {
		super();
		this.MAX_SPEED = 4;
		this.jumpingAnimationTimer = new Timer(16);
		this.deathAnimationTimer = new Timer(16, false, 5);
		this.lockedObject = null;
		this.reset();
		this.isInvincible = false;
		this.isDying = false;
		this.deadX = 0;
		this.deadY = 0;
	}
	die() {
		if (this.isInvincible) {
			return;
		}
		this.deathAnimationTimer.start();
		this.isDying = true;
		this.deadX = this.x;
		this.deadY = this.y;	
		this.reset();
	}
	reset() {
		this.lockToObject(null);
		this.isJumping = false;
		this.isMoving = false;
		this.x = GameUtilities.TILE_WIDTH
			* Math.floor(GameUtilities.COLS / 2);
		this.y = GameUtilities.ScreenDimension.HEIGHT
			- GameUtilities.TILE_HEIGHT;
	}
	lockToObject(gameObject) {
		this.lockedObject = gameObject;
	}
	jump() {
		this.isJumping = true;
		this.isMoving = true;
		this.jumpingAnimationTimer.start();
	}
	update() {
		super.update();

		if (this.isDying) {
			if (!this.deathAnimationTimer.update()) {
				this.isDying = false;
			}
			return;
		}
	
		if (this.isJumping) {	
			if (!this.jumpingAnimationTimer.update()) {
				this.isJumping = false;
				this.isMoving = false;
			}
		}
		if (this.lockedObject) {
			this.x += this.lockedObject.xSpeed;
		}
	}
}
