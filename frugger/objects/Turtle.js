class Turtle extends GameObject {
	constructor(x, y, dir, dives = false) {
		super(x, y, dir);
		this.State = {
			IDLE: 0,
			DIVING: 1,
			UNDERWATER: 2,
			SURFACING: 3
		};

		this.state = this.State.IDLE;
		this.type = GameUtilities.GameObjectType.Turtle;
		this.divingAnimationTimer = new Timer(16, false, 10);
		this.surfacingAnimationTimer = new Timer(16, false, 10);
		this.idleTimer = new Timer(16, false, 10);
		this.underwaterTimer = new Timer(16, false, 10);
		this.dives = dives;
		this.isMoving = true;
		this.isDiving = false;
		this.isSurfacing = false;
		this.isUnderwater = false;
		this.isIdle = true;

		if (this.dives) {
			this.idleTimer.start();
		}
	}

	moveBehavior() {
		this.linearMovement();
		this.wrapHorizontally(
			GameUtilities.COLS * GameUtilities.TILE_WIDTH
		);
	}

	update() {
		super.update();

		if (!this.dives) {
			return;
		}

		switch (this.state) {
			case this.State.IDLE:
				if (!this.idleTimer.update()) {
					this.state = this.State.DIVING;
					this.divingAnimationTimer.start();
					this.isDiving = true;	
					this.isIdle = false;
				}
			break;
			case this.State.DIVING:
				if (!this.divingAnimationTimer.update()) {
					this.state = this.State.UNDERWATER;
					this.underwaterTimer.start();
					this.isDiving = false;
					this.isUnderwater = true;
				}
			break;
			case this.State.UNDERWATER:
				if (!this.underwaterTimer.update()) {
					this.state = this.State.SURFACING;
					this.surfacingAnimationTimer.start();
					this.isUnderwater = false;
					this.isSurfacing = true;
				}
			break;
			case this.State.SURFACING:
				if (!this.surfacingAnimationTimer.update()) {
					this.state = this.State.IDLE;
					this.idleTimer.start();
					this.isSurfacing = false;
					this.isIdle = true;
				}
			break;
			default: break;
		}
	}
}
