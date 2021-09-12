"use strict";

class GameObject {
	constructor(x, y, dir) {
		this.MAX_SPEED = 1;

		this.State = {
			IDLE: 0,
			MOVE: 1
		};
		this.type = 0;
		this._x = x;
		this._y = y;
		this.state = this.State.IDLE;
		this.dir = GameUtilities.Direction.NORTH;
		this.width = GameUtilities.TILE_WIDTH;
		this.height = GameUtilities.TILE_HEIGHT;
		this.xSpeed = 0;
		this.ySpeed = 0;

		this.isActive = false;
		this.isMoving = false;

		this.movingAnimation = new Timer(2, true, 10);

		this.hitBox = new HitBox();
		this.tileHitBox = this.hitBox;
		this.rotate(dir);
	}
	set x(val) {
		this._x = val;
		this.hitBox.move(this);
	}

	set y(val) {
		this._y = val;
		this.hitBox.move(this);
	}

	get x() { return this._x; }
	
	get y() { return this._y; }

	getCenter() {
		return {
			x: this.x + (this.width / 2),
			y: this.y + (this.height / 2)
		};
	}

	getHitBoxPoints() {
		return this.hitBox.getCornerPoints();
	}

	getFuturePosition(xSpeed = this.xSpeed, ySpeed = this.ySpeed) {
		return {
			x: this._x + xSpeed,
			y: this._y + ySpeed
		};
	}
	rotateRandomCardinalDirection() {
		this.rotate(GameUtilities.calculateRandomCardinalDirection());
	}
	stop() {
		this.isMoving = false;
		this.xSpeed = 0;
		this.ySpeed = 0;
	}
	reset() {
		this.stop();
	}
	die() {
		this.isActive = false;
	}
	setPosition(x, y) {
		this.x = x;
		this.y = y;
	}
	updateMovementVector() {
		const rads = GameUtilities.degreesToRadians(this.dir);
		const { xSpeed, ySpeed } =
			GameUtilities.calculateMovementVector(rads, this.MAX_SPEED);
		const { xSpeed: recoilXSpeed, ySpeed: recoilYSpeed } =
			GameUtilities.calculateMovementVector(
				rads,
				this.MAX_RECOIL_SPEED
			);

		// TODO: for some reason reversing x and y speed gives correct movement
		this.xSpeed = ySpeed;
		this.ySpeed = xSpeed;
		this.recoilXSpeed = recoilYSpeed;
		this.recoilYSpeed = recoilXSpeed;

		// y increases downwards
		this.ySpeed *= -1;
	}
	rotate(dir) {
		this.dir = dir;
		this.updateMovementVector();
		this.hitBox.move(this);
	}
	aboutFace() {
		this.dir = GameUtilities.reflectAngle(this.dir);
		this.rotate(this.dir);
	}
	linearMovement(xSpeed = this.xSpeed, ySpeed = this.ySpeed) {
		const { x, y } = this.getFuturePosition(xSpeed, ySpeed);
		this.x = x;
		this.y = y;
	}

	wrapHorizontally(padding = 0) {
		if (this.dir === GameUtilities.Direction.EAST) {
			if (
				this.x > (GameUtilities.ScreenDimension.WIDTH + padding)
				+ this.width
			) {
				this.x = this.width * -1;
			}
		} else if (this.dir === GameUtilities.Direction.WEST) {
			if (
				this.x < (padding * -1) - this.width
			) {
				this.x = GameUtilities.COLS * GameUtilities.TILE_WIDTH;
			}
		} 
	}

	moveBehavior() {
		this.linearMovement();
		this.wrapHorizontally();
	}

	move() {
		this.moveBehavior();

		if (this.movingAnimation.isRunning()) {
			this.movingAnimation.update();
		}
	}
	update() {
		if (this.isMoving) {
			this.move();
		}
	}
}
