"use strict";

const GameUtilities = {
	COLS: 15,
	ROWS: 14,
	ScreenDimension: {
		WIDTH: 15 * 64,
		HEIGHT: 14 * 64 
	},
	ScreenCenter: { 
		X: 475, 
		Y: 325 
	},
	Direction: {
		NORTH: 0,
		EAST: 90,
		SOUTH: 180,
		WEST: 270
	},
	TileType: {
		DIRT: 0,
		ROAD: 1,
		WATER: 2,
		GRASS: 3,
		GOAL: 4,
		BLANK: 5
	},
	EffectType: {
	},
	EnemyType: {
		CAR: 0,
		BULLDOZER: 1,
		TRUCK: 2,
		SNAKE: 3,
		ALIGATOR: 4
	},
	PickupType: {
		FLY: 0
	},
	GameObjectType: {
		LOG: 0,
		TURTLE: 1
	},
	TILE_WIDTH: 64,
	TILE_HEIGHT: 64,
	gameTime: {
		fps: 0,
		totalFrames: 0,
		currentSeconds: 0,
		totalSeconds: 0,
		lastSeconds: 0
	},

	isMobile() {
		return window.innerHeight > window.innerWidth
	},
	calculateFPS() {
		const secondsIncreased = this.calculateGameTime();

		this.gameTime.totalFrames++;

		if (this.gameTime.totalFrames > 1000000000) {
			this.gameTime.totalFrames = 0;
		}

		this.fps = parseInt(this.gameTime.totalFrames / this.gameTime.totalSeconds);

		return secondsIncreased;
	},
		
	calculateGameTime() {
		this.gameTime.currentSeconds = Math.floor(Date.now() / 1000);

		if (this.gameTime.currentSeconds !== this.gameTime.lastSeconds) {
			this.gameTime.lastSeconds = this.gameTime.currentSeconds;
			this.gameTime.totalSeconds++;

			if (this.gameTime.totalSeconds > 1000000000) {
				this.gameTime.totalSeconds = 0;
			}

			return true;
		}

		return false;
	},

	cleanMap(map) {
		const cleanMap = map.replace(/[\r\n\t]/g, "");

		return cleanMap;
	},
	makeEnemy(enemyType, x, y) {
		let enemy;

		switch(enemyType) {

		}

		enemy.x = x;
		enemy.y = y;

		return enemy;
	},
	makePickup(x, y, pickupType = null) {
		let typeToCreate;
		let pickup;

		pickup = new Pickup(typeToCreate);
		pickup.x = x;
		pickup.y = y;
		pickup.isActive = true;

		return pickup;
	},
	screenBoundsReached(gameObject) {
		const { x, y } = gameObject;

		return (
			x > this.ScreenDimension.WIDTH
			|| x < 0
			|| y > this.ScreenDimension.HEIGHT
			|| y < 0
		);
	},
	withinPointRange(x, y, targetX, targetY, threshold) {
		return (
			(x > targetX - threshold)
			&& (x < targetX + threshold)
			&& (y > targetY - threshold)
			&& (y < targetY + threshold)
		);
	},
	radiansToDegrees(radians) {
		return radians * (180 / Math.PI);
	},
	degreesToRadians(degrees) {
		return degrees * (Math.PI / 180);
	},
	normalizeDirection(degrees) {
		let cookedDir = degrees;
		if (degrees < 0) {
			// if degrees value is provided with atan2 it will be from -180 - 180
			cookedDir = (360 - (-degrees));
		}
		// 0 points east by default, change it to point north
		// change angle to be north = 0, south = 180
		cookedDir += 90;
		if (cookedDir > 360) {
			cookedDir = cookedDir - 360;
		}
		return cookedDir;
	},
	reflectAngle(degrees) {
		let reflectedAngle = degrees;

		if (degrees === 360 || degrees === 0) {
			reflectedAngle = GameUtilities.Direction.SOUTH;
		} else if (degrees === GameUtilities.Direction.EAST) {
			reflectedAngle = GameUtilities.Direction.WEST;
		} else if (degrees === GameUtilities.Direction.SOUTH) {
			reflectedAngle = GameUtilities.Direction.NORTH;
		} else if (degrees === GameUtilities.Direction.WEST) {
			reflectedAngle = GameUtilities.Direction.EAST;
		}

		return reflectedAngle;
	},
	calculateRandomCardinalDirection() {
		const dir = Math.floor(Math.random() * 4) * 90;

		return dir;
	},
	calculateMovementVector(radians, speed) {
		return {
			xSpeed: Math.cos(radians) * speed,
			ySpeed: Math.sin(radians) * speed
		};
	},
	turnTowardsPoint(objectX, objectY, targetX, targetY) {
		const rads = Math.atan2(targetY - objectY , targetX - objectX);
		const degrees = GameUtilities.radiansToDegrees(rads);

		return GameUtilities.normalizeDirection(degrees);
	},
	numberInRange(val, max, min = 0) {
		return (val > min && val < max);
	},
	reflectDir(dir) {
		if (dir === 0 || dir === 360) {
			return 180;
		} else if (dir === 90) {
			return 270;
		} else if (dir === 270) {
			return 90;
		} else {
			return 0;
		}
	},

	setBound(val, max) {
		if (val >= max) return 0;
		if (val <= 0) return max;
		return val;
	},
	outOfBounds(gameObject, width, height) {
		const { x, y } = gameObject;

		return (
			!numberInRange(x, width)
			|| !numberInRange(y, height)
		);	
	},

	shouldRedraw(game) {
		const { player } = game;
		//const movedEnemies = enemies.filter(enemy => enemy.hasMoved );
return true;
		//if (movedEnemies.length > 0) return true;

		if (player.xSpeed !== 0
			|| player.ySpeed !== 0) {
			return true;
		}
		return false;
	},
	getCheckTiles(gameObject, tiles) {
		const { x1, y1, x2, y2, w1, h1, w2, h2 } = gameObject.getHitBoxPoints();
		const checkTile = this.getTile(
			tiles,
			x1, y1,
			this.TILE_WIDTH,
			this.TILE_HEIGHT
		);
		const checkTile2 = this.getTile(
			tiles,
			x2, y2,
			this.TILE_WIDTH,
			this.TILE_HEIGHT
		);

		return [checkTile, checkTile2];
	},

	objectCanCrossTile(tile, gameObject, TileTypes) {
		const { type, isWalkable } = tile;
		const { canSwim, canMoveOnLand } = gameObject;

		if (type === TileTypes.WATER
			&& canSwim) {
			return true;
		} else if (type !== TileTypes.WATER
			&& !canMoveOnLand) {
			// water based enemies can't go on land
			return false;
		}
		
		return isWalkable;
	},
	objectCanMoveForward(gameObject, tiles) {
		const checkTiles = this.getCheckTiles(gameObject, tiles);

		for (let i=0; i<checkTiles.length; i++) {
			const tile = checkTiles[i];

			if (!this.objectCanCrossTile(tile, gameObject, this.TileType)) {
				return false;
			}
		}

		return true;	
	},
	hitTest(obj, obj2) {
		const { x, y } = obj;
		const { x: x2, y: y2, width: w2, height: h2 } = obj2;
		const maxBoundX = x2 + w2;
		const maxBoundY = y2 + h2;
		// checks if point 1 is withing object 2
		const isWithinBox = x > x2 && x < maxBoundX
				&& y > y2 && y < maxBoundY;

		return isWithinBox;
	},
	hitTestAnyPoint(points, obj) {
		for (let i=0; i<points.length; i++) {
			if (this.hitTest(points[i], obj)) {
				return true;
			}
		}

		return false; 
	},
	getTile(tiles, x, y, tileWidth, tileHeight) {
		const row = Math.floor(y / tileWidth);
		const col = Math.floor(x / tileHeight);

		return tiles[row][col];
	},
	pixelToTile(x, y, tiles) {
		const row = Math.floor(y / GameUtilities.TILE_HEIGHT);
		const col = Math.floor(x / GameUtilities.TILE_WIDTH);

		return tiles[row][col];
	},
	tileToPixel(row, col, TILE_WIDTH = this.TILE_WIDTH, TILE_HEIGHT = this.TILE_HEIGHT) {
		const x = col * TILE_WIDTH;
		const y = row * TILE_HEIGHT;

		return { x, y };
	},
	checkScreenChange(testX, testY, screenRow, screenCol) {
		if (
			testY >= this.HEIGHT
			|| testX >= this.WIDTH
			|| (testY < 0 && screenRow > 0)
			|| (testX < 0 && screenCol > 0)
		) {
			return true;
		}

		return false;
	},

	wrapPlayerPosition(x, y, WIDTH, HEIGHT) {
		return {
			x: this.setBound(x, WIDTH),
			y: this.setBound(y, HEIGHT)
		};
	},
	clampDirToCardinal(dir) {
		// clamp to cardinal directions
		let clampedDir = Math.abs(dir);
		let cardinalDir = 0;

		if (this.numberInRange(clampedDir, 91, 0)) {
			cardinalDir = 90;
		} else if (this.numberInRange(clampedDir, 181,  89)) {
			cardinalDir = 180;
		} else if (this.numberInRange(clampedDir, 271, 179)) {
			cardinalDir = 270;
		}

		return cardinalDir;
	},
	changeScreen(testX, testY, screenRow, screenCol) {
		let newScreenRow = screenRow;
		let newScreenCol = screenCol;
		let newScreen;

		if (testY >= this.HEIGHT) {
			newScreenRow++;
		}
		if (testY < 0 && screenRow > 0) {
			newScreenRow--;
		}
		if (testX < 0 && screenCol > 0) {
			newScreenCol--;
		}

		if (testX >= this.WIDTH) {
			newScreenCol++;
		}

		return {
			newScreenCol,
			newScreenRow
		};	
	}
}
