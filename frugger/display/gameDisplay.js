game.display = {
	context: {},
	images: {},
	imageUrls: [
		'frugger/frugger.png',
		'background/background.png',
		'log/log.png',
		'car/car.png',
		'life/life.png',
		'fly/fly.png',
		'death/death.png',
		'goal/goal.png',
		'font/font.png',
		'turtle/turtle.png'
	],
	$gameWin: {},
	$gameLose: {},
	TOTAL_ANIMATION_FRAMES: 4,
	init() {
		const $canvas = document.getElementById('canvas');

		$canvas.width = GameUtilities.ScreenDimension.WIDTH;
		$canvas.height = GameUtilities.ScreenDimension.HEIGHT;
		this.context = $canvas.getContext('2d');
		this.images = GameUtilities.graphics.loadImages(this.imageUrls);
		this.$gameWin = document.getElementById('gameWin');
		this.$gameLose = document.getElementById('gameLose');
		GameUtilities.graphics.images = this.images;
	},
	drawTiles(tiles) {
		let sourceX = 0;
		let sourceY = 0;

		for (let row=0; row<GameUtilities.ROWS; row++) {
			for (let col=0; col<GameUtilities.COLS; col++) {
				const { type } = tiles[row][col];
				const x = col * GameUtilities.TILE_WIDTH;
				const y = row * GameUtilities.TILE_HEIGHT;
				sourceX = 0;
				sourceY = 0;

				if (type === GameUtilities.TileType.BLANK) {
					continue;
				}

				if (type === GameUtilities.TileType.GRASS) {
					sourceX = GameUtilities.TILE_WIDTH;
				} else if (type === GameUtilities.TileType.WATER) {
					sourceX = GameUtilities.TILE_WIDTH * 2;
				} else if (type === GameUtilities.TileType.GOAL) {
					sourceY = GameUtilities.TILE_HEIGHT;
				} else if (type === GameUtilities.TileType.ROAD) {
					sourceX = GameUtilities.TILE_WIDTH * 3;
				}

				GameUtilities.graphics.drawTile(
					this.context,
					'background/background.png',
					x, y,
					sourceX, sourceY
				);
			}
		}
	},
	calculateAnimationFrame(animationTimer) {
		const time = animationTimer.getTime();
		const frame = Math.floor(
			time / this.TOTAL_ANIMATION_FRAMES
		);

		return frame;
	},
	reverseAnimationFrame(frame) {
		let reversedFrame = Math.abs(
			frame - (this.TOTAL_ANIMATION_FRAMES - 1)
		);

		return reversedFrame;
	},
	
	drawFly(fly) {
		const { x, y } = fly;

		GameUtilities.graphics.drawTile(
			this.context,
			'fly/fly.png',
			x, y
		);
	},

	drawLogs(logs) {
		logs.forEach(log => {
			const { x, y, width, height } = log;
			let sourceX = 0;
			let sourceY = 0;

			this.context.drawImage(
				this.images.get('log/log.png'),
				sourceX, sourceY,
				width, height,
				x, y,
				width, height
			);
		});
	},
	drawTurtles(turtles) {
		turtles.forEach(turtle => {
			const { x, y, isUnderwater, isIdle, isSurfacing, isDiving } = turtle;
			let sourceX = 0;

			if (isUnderwater) {
				return;
			}

			if (!isIdle) {
				let animationTimer;
				let frame;

				if (isDiving) {
					animationTimer = turtle.divingAnimationTimer;
				} else {
					animationTimer = turtle.surfacingAnimationTimer;
				}
				frame = this.calculateAnimationFrame(
					animationTimer
				);
				if (isSurfacing) {
					frame = this.reverseAnimationFrame(frame);
				}
				sourceX = GameUtilities.TILE_WIDTH * frame;
			}

			GameUtilities.graphics.drawTile(
				this.context,
				'turtle/turtle.png',
				x, y, sourceX, 0
			);
		});
	},
	drawCars(cars) {
		cars.forEach(car => {
			const { x, y, type, tiresAnimationTimer } = car;
			let sourceX = 0;
			let sourceY = 0;

			if (tiresAnimationTimer.getTime() < tiresAnimationTimer.getMaxTime() / 2) {
				sourceY = GameUtilities.TILE_HEIGHT;
			}

			if (type === GameUtilities.EnemyType.BULLDOZER) {
				sourceX = GameUtilities.TILE_WIDTH;
			} else if (type === GameUtilities.EnemyType.TRUCK) {
				sourceX = GameUtilities.TILE_WIDTH * 2;
			}

			if (type === GameUtilities.EnemyType.TRUCK) {
				this.context.drawImage(
					this.images.get('car/car.png'),
					sourceX, 0,
					GameUtilities.TILE_WIDTH * 2, GameUtilities.TILE_HEIGHT,
					x, y,
					GameUtilities.TILE_WIDTH * 2, GameUtilities.TILE_HEIGHT
				);
			} else {
				GameUtilities.graphics.drawTile(
					this.context,
					'car/car.png',
					x, y, sourceX, sourceY
				);
			}

		});
	},

	drawPlayer(player) {
		const { x, y, dir, isDying,
			deathAnimationTimer, jumpingAnimationTimer } = player;
		let frame;

		if (isDying) {
			frame =	this.calculateAnimationFrame(
				deathAnimationTimer
			);
		} else {
			if (!player.isJumping) {
				frame = 1;
			} else {
				frame = this.reverseAnimationFrame(
					this.calculateAnimationFrame(
						jumpingAnimationTimer
					)
				);
			}
		}

		const sourceX = GameUtilities.TILE_WIDTH * frame;
		let sourceY = 0;

		if (isDying) {
			GameUtilities.graphics.drawTile(
				this.context,
				'death/death.png',
				player.deadX, player.deadY,
				sourceX, sourceY 
			);

			return;
		}

		if (dir === GameUtilities.Direction.EAST) {
			sourceY = GameUtilities.TILE_HEIGHT;
		} else if (dir === GameUtilities.Direction.SOUTH) {
			sourceY = GameUtilities.TILE_HEIGHT * 2;
		} else if (dir === GameUtilities.Direction.WEST) {
			sourceY = GameUtilities.TILE_HEIGHT * 3;
		}

		GameUtilities.graphics.drawTile(
			this.context,
			'frugger/frugger.png',
			x, y,
			sourceX, sourceY
		);
	},
	drawFilledGoals(goals) {
		for (let i=0; i<goals.length; i++) {
			if (!goals[i]) {
				continue;
			}

			const x = i * 3 * GameUtilities.TILE_WIDTH + GameUtilities.TILE_WIDTH;

			GameUtilities.graphics.drawTile(
				this.context,
				'goal/goal.png',
				x, GameUtilities.TILE_HEIGHT
			);
		}
	},	
	drawHUD(lives, score, timeLeft) {
		const width = GameUtilities.TILE_WIDTH / 2;
		const height = GameUtilities.TILE_HEIGHT / 2;
		let x = 0;

		// draw lives
		GameUtilities.graphics.drawText(
			this.context,
			'lives',
			0, 0
		);	
		for (let i=0; i<lives; i++) {
			this.context.drawImage(
				this.images.get('life/life.png'),
				0, 0, width, height,
				x, GameUtilities.TILE_HEIGHT / 2,
				width, height
			);
			x += GameUtilities.TILE_WIDTH;
		}

		// draw timebar
		GameUtilities.graphics.drawText(
			this.context,
			`time`,
			GameUtilities.TILE_WIDTH * 9, 0
		);
		GameUtilities.graphics.drawText(
			this.context,
			`${timeLeft}`,
			GameUtilities.TILE_WIDTH * 9,
			GameUtilities.TILE_HEIGHT / 2
		);
	
		// draw score
		GameUtilities.graphics.drawText(
			this.context,
			`score`,
			GameUtilities.TILE_WIDTH * 5,
			0
		);
		GameUtilities.graphics.drawText(
			this.context,
			`${score}`,
			GameUtilities.TILE_WIDTH * 5,
			GameUtilities.TILE_HEIGHT / 2	
		);	
		// draw 1-up goal
	},

	drawHitbox(gameObject) {
		const { hitBox } = gameObject;
		const forwardPoint = hitBox.getForwardPoint();
		const centerPoint = hitBox.getCenterPoint();

		this.context.strokeRect(
			hitBox.x, hitBox.y,
			hitBox.width, hitBox.height
		);
		this.context.strokeRect(
			forwardPoint.x, forwardPoint.y,
			forwardPoint.width, forwardPoint.height
		);
		this.context.strokeRect(
			centerPoint.x, centerPoint.y,
			centerPoint.width, centerPoint.height
		);
	},

	drawHitboxes(gameObjects) {
		gameObjects.forEach(gameObject => {
			this.drawHitbox(gameObject);
		});
	},

	drawGameLose() {
		if (this.$gameLose.classList.contains('d-none')) {
			this.$gameLose.classList.remove('d-none');
		}
	},
	drawGameWin() {
		if (this.$gameWin.classList.contains('d-none')) {
			this.$gameWin.classList.remove('d-none');
		}
	},
	draw(game) {
		const { lives, player, logs, turtles, tiles,
			timeLeft, score, fly, cars, goals,
			gameState, isDebug, GameState } = game;

		if (gameState === GameState.GAME_LOSE) {
			this.drawGameLose();
			return;
		}

		if (gameState === GameState.GAME_WIN) {
			this.drawGameWin();
			return;
		}
 
		GameUtilities.graphics.clearContext(this.context);
		this.drawTiles(tiles);
		this.drawLogs(logs);
		this.drawTurtles(turtles);
		this.drawCars(cars);
		if (fly.isActive) {
			this.drawFly(fly);
		}
		this.drawPlayer(player);
		this.drawFilledGoals(goals);
		this.drawHUD(lives, score, timeLeft);
		if (isDebug) {
			this.drawHitboxes(logs);
			this.drawHitboxes(turtles);
			this.drawHitboxes(cars);
			this.drawHitbox(player);	
		}
	}
}
