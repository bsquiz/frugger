GameUtilities.graphics = {
	context: null,
	lightSourceImage: null,
	loaded: false,
	lightSourceDestination: null,
	TILE_WIDTH: GameUtilities.TILE_WIDTH,
	TILE_HEIGHT: GameUtilities.TILE_HEIGHT,	
	WIDTH: GameUtilities.ScreenDimension.WIDTH,
	HEIGHT: GameUtilities.ScreenDimension.HEIGHT,
	Direction: GameUtilities.Direction,
	animatedText: '',
	animateLetterTimer: new Timer(20),
	currentAnimatedLetterIndex: 0,
	isAnimatingText: false,
	currentAnimatedText: '',
	
	makeClipSource(types, animationFrames = 1, directions = 4) {
		const sourceMap = {};
		const dirMap = [
		    GameUtilities.Direction.NORTH,
		    GameUtilities.Direction.EAST,
		    GameUtilities.Direction.SOUTH,
		    GameUtilities.Direction.WEST
		];
		const dirOffset = [
		    0,
		    this.TILE_WIDTH * 1,
		    this.TILE_WIDTH * 2,
		    this.TILE_WIDTH * 3,
		];
        let typeIndex = 0;
        let startOffset = 0;
        for (let t=0; t<types.length; t++) {
            sourceMap[t] = {};

            for (let i=0; i<animationFrames; i++) {
                sourceMap[t][i] = {};

                for (let j=0; j<directions; j++) {
                    sourceMap[t][i][dirMap[j]] = [
                        dirOffset[j] + startOffset,
                        typeIndex * this.TILE_HEIGHT
                    ];
                }
                startOffset += this.TILE_WIDTH * animationFrames;
            }

            startOffset = 0;

            typeIndex += 1;
        };

        return sourceMap;
    },
    loadImages(urls) {
	const images = new Map();
        let totalImagesLoaded = 0;

        urls.forEach(imageUrl => {
            const img = new Image();

            images.set(imageUrl, img);

            img.src = 'img/' + imageUrl;
            //console.log(`loading: ${imageUrl}`);
            img.addEventListener('load', () => {
                //console.log(`loaded: ${imageUrl}`);
                totalImagesLoaded++;
                if (totalImagesLoaded === urls.length) {
                    this.loaded = true;
			this.lightSourceImage = images.get('map/replace_me.png');
                }
            });
        });

	return images;
    },
   getClipSource(gameObject, cardinalDir, SpriteSheet) {
        /*
            SpriteSheet = enemies, player, etc
            sprite sheet structure:
            row: game object type (snake, ghost, etc)
            col:
                0 - 3:      static - n, e, s, w
                4 - 7:      move 1 - n, e, s, w
                7 - 10:     move 2 - n, e, s, w
                11 - 14:    attack - n, e, s, w
        */ 
		const { isMoving, isAttacking,
			walkingAnimation, type } = gameObject;
        let clipSource;

        if (isMoving) {
            // either frame set 1 or 2
            clipSourceAction = walkingAnimation.getTime() + 1;
        } else if (isAttacking) {
            // attacking is last frame set
            clipSourceAction = 3;
        } else {
            // idle frame set
            clipSourceAction = 0;
        }

        clipSource = SpriteSheet[type][clipSourceAction][cardinalDir];

        return clipSource;
    },
	clearContext(context) {
		context.clearRect(
			0, 0,
			GameUtilities.ScreenDimension.WIDTH,
			GameUtilities.ScreenDimension.HEIGHT
		);
	},
	drawTile(context, imageUrl, x, y, sourceX = 0, sourceY = 0) {
		const image = this.images.get(imageUrl);

		context.drawImage( 
			image,
			sourceX, sourceY,
			GameUtilities.TILE_WIDTH, GameUtilities.TILE_HEIGHT,
			x, y,
			GameUtilities.TILE_WIDTH, GameUtilities.TILE_HEIGHT
		);
	},
	drawBox({x,y,width,height}) {
		this.context.strokeRect(
			x, y, width, height
		);
	},
	drawHitBox(hitBox) {
            const { x1, y1, w1, h1, x2, y2, w2, h2 } = hitBox.getCornerPoints();

            this.drawBox(hitBox.getForewardPoint());
            this.drawBox(hitBox.getCenterPoint());
            this.drawBox(hitBox);
    //      this.drawBox(x1, y1, w1, h1);
    //      this.drawBox(x2, y2, w2, h2);

	},
	getHurtImage(img, invincibleFrame) {
		let imgUrl = img;
		let hurtImg;

		if (invincibleFrame % 10 > 0) {
			const parts = imgUrl.split('.');
			hurtImg = parts[0] + '_hurt.png';
		} else {
			hurtImg = imgUrl;
		}

		return hurtImg;
	},

	startAnimatingText(text) {
		this.animatedText = text;
		this.currentAnimatedLetterIndex = 0;
		this.animateLetterTimer.start();
		this.isAnimatingText = true;
	},

	progressAnimatedText() {
		const letterToDraw = this.animatedText[this.currentAnimatedLetterIndex];

		this.currentAnimatedText += letterToDraw;
		this.drawText(this.currentAnimatedText);
		this.currentAnimatedLetterIndex++;

		if (this.currentAnimatedLetterIndex === this.animatedText.length) {
			this.isAnimatingText = false;
		}
	},	
	
	drawText(
		context,
		text, x, y,
		charWidth = (this.TILE_WIDTH / 2),
		charHeight = (this.TILE_HEIGHT / 2)
	) {
		const upperCase = text.toUpperCase();
		const aCharOffset = 65; // char a starts at ascii code 65
		const numberOffset = 15;
		let drawX = x;
		let drawY = y;

		for (let i=0; i<upperCase.length; i++) {
			const character = upperCase[i];
			const asciiCode = character.charCodeAt(0);
			let offsetCode = asciiCode - aCharOffset;
			let sourceX = 0;
			let sourceY = 0;

			if (Number.isInteger(parseInt(character))) {
				offsetCode = numberOffset + parseInt(character);
				sourceY = 8 * 4;
			}

			// each character is 8 pixels wide and the image has been scaled to 4x
			sourceX = offsetCode * 8 * 4;

			drawX += charWidth;

			if (asciiCode === 32) {
				// space
				continue;
			}

			context.drawImage(
				this.images.get('font/font.png'),
				sourceX, sourceY,
				charWidth, charHeight, 
				drawX, drawY,
				charWidth, charHeight 
			);
		}
	},

	drawHitbox(gameObject) {
		const { hitBox } = gameObject;
		const { x, y, width, height } = hitBox;

		this.context.strokeRect(x, y, width, height);
	},

	drawGameObject(gameObject, img, sourceX, sourceY) {
		const { x, y, width, height } = gameObject;
		
		this.context.drawImage(
			img,
			sourceX, sourceY,
			width, height,
			x, y,
			width, height
		);
	},
	setLightSourceDestination(destination) {
		this.lightSourceDestination = destination;
	},
	drawLightSource(sourceX, sourceY, width = 516, height = 516) {

		this.lightSourceDestination.globalCompositeOperation = 'destination-in';
		this.lightSourceDestination.drawImage(
			this.lightSourceImage,
			sourceX - 256, sourceY - 256,
			width, height
		);

		this.lightSourceDestination.globalCompositeOperation = 'source-over';
	},
}

