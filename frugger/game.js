"use strict"

const game = {
	GOAL_POINTS: 100,
	FLY_POINTS: 100,

	GameState: {
		PLAYING: 0,
		END_FANFARE: 1,
		END_FADE: 2,
		LEVEL_WIN: 3,
		GAME_WIN: 4,
		GAME_LOSE: 5,
		MENU: 6
	},
	isDebug: false,
	updateFrame: true,

	gameState: 6,
	gameLevel: 0,

	lives: 3,
	score: 0,
	timeLeft: 180,
	
	display: {},
	player: {},

	tiles: [],
	enemies: [],
	logs: [],
	turtles: [],
	cars: [],
	fly: {},
	femaleFrog: {},
 
	goals: [ false,false,false,false,false ],
	endFanfareTimer: new Timer(60),
	endFadeTimer: new Timer(60),

	init() {
		const urlParams = new URLSearchParams(window.location.search);

		this.tiles = this.initLevel();
		this.player = new Player();
		this.fly = new Fly(); 
		this.isDebug = (urlParams.get('debug'));

		this.display.init(this);
		this.audio.load();

		this.Input.init();
		document.getElementById('gameStartButton').addEventListener('click', () => game.startGame() );

		if (GameUtilities.isMobile()) {
			document.getElementById('directionButtons').classList.remove('d-none');
			this.Input.mode = this.Input.Mode.TOUCH;
		}
	},
	reset() {
		this.goals = [ false,false,false,false,false ];
		this.lives = 3;
		this.score = 0;
		this.timeLeft = 180;

		this.logs = [
			...this.makeLogsRow(5),
			...this.makeLogsRow(3, GameUtilities.Direction.EAST, true),
			...this.makeLogsRow(2, GameUtilities.Direction.WEST)
		];
		this.turtles = [
			...this.makeTurtlesRow(6),
			...this.makeTurtlesRow(4, true)
		];
		this.cars = [
			...this.makeTruckRow(8),
			...this.makeCarsRow(9),
			...this.makeBulldozersRow(10),
			...this.makeCarsRow(11),
			...this.makeBulldozersRow(12)
		];
	
		this.activateFly();
	},

	startGame() {
		this.reset();
		document.getElementById('menu').classList.add('d-none');
		this.gameState = this.GameState.PLAYING;
	},
	activateFly() {
		this.fly.x = GameUtilities.TILE_WIDTH;
		this.fly.y = GameUtilities.TILE_HEIGHT;
		this.fly.isActive = true;
	},

	makeLogsRow(row, direction = GameUtilities.Direction.EAST, offsetRow = false) {
		const logs = [];
		const offsetRowCols = [1, 5, 9, 14, 19];
		let skipCol = 5;

		for (let i=0; i<GameUtilities.COLS * 2; i++) {
			if (offsetRow) {
				if (!offsetRowCols.includes(i)) {
					continue;
				}
			} else {
				if (i % 5 !== 0) {
					continue;
				}
			}

			logs.push(
				new Log(
					GameUtilities.TILE_WIDTH * i,
					GameUtilities.TILE_HEIGHT * row,
					direction,
				)
			);
		}

		return logs;
	},

	makeTurtlesRow(row, offsetRow = false) {
		const turtles = [];
		let shouldDive = (Math.floor(Math.random() * 2) === 1);
		let skipCol = 5;

		if (offsetRow) {
			skipCol = 4;
		}

		for (let i=0; i<GameUtilities.COLS * 2; i++) {
			if (i % skipCol === 0) {
				shouldDive = (Math.floor(Math.random() * 2) === 1);
				continue;
			}

			turtles.push(
				new Turtle(
					GameUtilities.TILE_WIDTH * i,
					GameUtilities.TILE_HEIGHT * row,
					GameUtilities.Direction.WEST,
					shouldDive
				)
			);
		}

		return turtles;
	},

	makeTruckRow(row) {
		/* 2 trucks back to back */
		return [
			new Truck(
				0, GameUtilities.TILE_HEIGHT * row, GameUtilities.Direction.EAST
			),
			new Truck(
				GameUtilities.TILE_WIDTH * 2,
				GameUtilities.TILE_HEIGHT * row, GameUtilities.Direction.EAST
			)
		];
	},

	makeCarsRow(row) {
		const cars = [];

		for (let i=0; i<GameUtilities.COLS; i++) {

			// every other tile
			if (i % 2 === 0) {
				continue;
			}

			/* leaves a gap like this:
				c*c*c*c**c*c** - repeat
			*/
			if (i % 5 === 0) {
				continue;
			} 

			cars.push(
				new Car(
					GameUtilities.TILE_WIDTH * (GameUtilities.COLS - i),
					GameUtilities.TILE_HEIGHT * row,
					GameUtilities.Direction.WEST
				)
			);
		}

		return cars;
	},

	makeBulldozersRow(row) {
		const bulldozers = [];

		for (let i=0; i<GameUtilities.COLS; i++) {

			if (i % 6 === 0) {
				bulldozers.push(
					new Bulldozer(
						i * GameUtilities.TILE_WIDTH,
						GameUtilities.TILE_HEIGHT * row,
						GameUtilities.Direction.EAST
					)
				);
			}
		}

		return bulldozers;
	},
	initLevel() {
		// g - grass
		// r - road
		// w - water
		// G - goal
		// b - blank

		const tiles = [];
		const tileToType = {
			'g': GameUtilities.TileType.GRASS,
			'w': GameUtilities.TileType.WATER,
			'r': GameUtilities.TileType.ROAD,
			'G': GameUtilities.TileType.GOAL,
			'b': GameUtilities.TileType.BLANK
		};
		const level = `
			ggggggggggggggg
			gGggGggGggGggGg
			wwwwwwwwwwwwwww
			wwwwwwwwwwwwwww
			wwwwwwwwwwwwwww
			wwwwwwwwwwwwwww
			wwwwwwwwwwwwwww
			ggggggggggggggg
			rrrrrrrrrrrrrrr
			rrrrrrrrrrrrrrr
			rrrrrrrrrrrrrrr
			rrrrrrrrrrrrrrr
			rrrrrrrrrrrrrrr
			ggggggggggggggg
		`;
		const rows = GameUtilities.ROWS;
		const cols = GameUtilities.COLS;
		const cleanMap = GameUtilities.cleanMap(level);

		for (let row=0; row<rows; row++) {
			tiles.push([]);
			for (let col=0; col<cols; col++) {
				const tileIndex = row * GameUtilities.COLS
					+ col;
				const tileType = cleanMap[tileIndex];
				const tile = new Tile(tileToType[tileType], row, col);

				tiles[row].push(tile);
			}
		}

		return tiles;
	},

	winGame() {
		document.getElementById('menu').classList.remove('d-none');
		this.gameState = this.GameState.WIN;
	},
	loseGame() {
		document.getElementById('menu').classList.remove('d-none');
		this.gameState = this.GameState.LOSE;
	},
	checkInputs() {
		//this.Input.debug();
		let dir = -1;

		if (this.Input.getInputReleased(this.Input.InputCode.A)) {	
		}

		if (this.Input.getInputActive(this.Input.InputCode.B)) {
		}

		if (this.Input.getInputActive(this.Input.InputCode.A)) {
		}

		if (this.Input.getInputReleased(this.Input.InputCode.LEFT)) {
			dir = GameUtilities.Direction.WEST;
		}
		if (this.Input.getInputReleased(this.Input.InputCode.RIGHT)) {
			dir = GameUtilities.Direction.EAST;
		}
		if (this.Input.getInputReleased(this.Input.InputCode.UP)) {
			dir = GameUtilities.Direction.NORTH;
		}
		if (this.Input.getInputReleased(this.Input.InputCode.DOWN)) {
			dir = GameUtilities.Direction.SOUTH;
		}
	
		if (dir !== -1) {
			this.player.rotate(dir);
			if (!this.player.isMoving && !this.player.isDying) {
				//this.audio.playSound(this.audio.sounds.jump);
				this.player.jump();
			}
		}
		this.Input.resetReleasedInputs();
	},

	updateLogs() {
		this.logs.forEach(log => {
			log.update();
		});
	},

	updateTurtles() {
		this.turtles.forEach(turtle => {
			turtle.update();
		});
	},

	updateCars() {
		this.cars.forEach(car => {
			car.update();
		});
	},

	updatePlayer() {
		this.player.update();
	},

	hitTests() {
		const { hitBox } = this.player;
		const centerPoint = hitBox.getCenterPoint();
		
		for (let i=0; i<this.cars.length; i++) {
			if (GameUtilities.hitTest(
				hitBox.getCenterPoint(),
				this.cars[i].hitBox
			)) {
				this.lives--;
				this.player.die();
				return;
			}
		}

		if (
			this.player.getFuturePosition().x > GameUtilities.ScreenDimension.WIDTH ||
			this.player.x < 0 ||
			this.player.getFuturePosition().y > GameUtilities.ScreenDimension.HEIGHT
		) {
			this.lives--;
			this.player.die();
			return;
		}
	},

	landingHitTests() {
		const { hitBox } = this.player;
		const centerPoint = hitBox.getCenterPoint();
	
		if (
			this.fly.isActive &&
			GameUtilities.hitTest(
					hitBox.getCenterPoint(),
					this.fly.hitBox
			)
		) {
			this.score += this.FLY_POINTS;
			this.fly.isActive = false;
		}
	
		for (let i=0; i<this.turtles.length; i++) {
			if (GameUtilities.hitTest(
				hitBox.getCenterPoint(),
				this.turtles[i].hitBox
			)) {
				const { isDiving } = this.turtles[i];

				if (isDiving) {
					this.player.die();
				} else {
					this.player.lockToObject(this.turtles[i]);
				}
				return;
			}
		}

		for (let i=0; i<this.logs.length; i++) {
			if (GameUtilities.hitTest(
				hitBox.getCenterPoint(),
				this.logs[i].hitBox
			)) {
				this.player.lockToObject(this.logs[i]);
				return;
			}
		}

		this.player.lockToObject(null);

		const currentTile = GameUtilities.pixelToTile(centerPoint.x, centerPoint.y, this.tiles);

		if (currentTile.type === GameUtilities.TileType.GOAL) {
			const goalIndex =  
				Math.floor(currentTile.col / 3);

			if (this.goals[goalIndex]) {
				// cant land on a filled goal
				this.lives--;
				this.player.die();
			} else {
				this.goals[goalIndex] = true;
				this.score += this.GOAL_POINTS;
				this.player.reset();
			}
		} else if (currentTile.type === GameUtilities.TileType.WATER) {
			// water kills frog for some reason...
			this.lives--;
			this.player.die();
		}
	},
	update() {
		this.display.draw(this);

		switch (this.gameState) {
			case this.GameState.END_FANFARE:
				if (!this.endFanfareTimer.update()) {
					this.gameState = this.GameState.END_FADE;
				}
			break;

			case this.GameState.END_FADE:
				if (!this.endFadeTimer.update()) {
					this.winGame();
				}
			break;

			case this.GameState.PLAYING:
				let shouldChangeScreen = false;

				const gameSecondsIncreased = GameUtilities.calculateFPS();

				if (gameSecondsIncreased) {
					this.timeLeft--;
				}
				this.updateTurtles();
				this.updatePlayer();
				this.updateLogs();
				this.updateCars();
				this.hitTests();

				if (!this.player.isJumping) {
					this.landingHitTests();
				}
				this.checkInputs();

				if (this.lives === 0 || this.timeLeft === 0) {
					this.loseGame();
				}
				if (!this.goals.includes(false)) {
					this.winGame();
				}
			break;
			case this.GameState.LEVEL_WIN:
				// only 1 level for now
				this.gameState = this.GameState.GAME_WIN;
			break;
			case this.GameState.GAME_WIN:
			break;
			case this.GameState.GAME_LOSE:
			break;
			case this.GameState.MENU:
			break;
			default: break;
		}

		window.requestAnimationFrame(function() { game.update(); });
	}
};
