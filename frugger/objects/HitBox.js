class HitBox {
	constructor() {
		this.x = 0;
		this.y = 0;
		this.width = 0;
		this.height = 0;
		this.dir = 0;
	}
	move(anchor) {
		const { x, y, width, height, dir } = anchor;

		this.dir = dir;
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	getForwardPoint() {
		const { x1, y1, w1, h1 } = this.getCornerPoints();
		return {
			x: x1, y: y1,
			width: w1, height: h1
		};
	}

	getCenterPoint() {
		return {
			x: this.x + this.width / 2,
			y: this.y + this.height / 2,
			width: 5,
			height: 5
		};
	}
	getAllCornerPoints() {
		const facePoints = [
		this.getCornerPoints(GameUtilities.Direction.NORTH),
		this.getCornerPoints(GameUtilities.Direction.EAST),
		this.getCornerPoints(GameUtilities.Direction.SOUTH),
		this.getCornerPoints(GameUtilities.Direction.WEST)
		];
		const points = [];

		for (let i=0; i<facePoints.length; i++) {
			points.push({
				x: facePoints[i].x1, y: facePoints[i].y1,
				width: facePoints[i].w1, height: facePoints[i].h1
			});
			points.push({
				x: facePoints[i].x2, y: facePoints[i].y2,
				width: facePoints[i].w2, height: facePoints[i].h2
			});
		}
	
		return points;	
	}
	getCornerPoints(dir = this.dir) {
		/*
		  []  []
		[] ---- []
		   |  |
		   |  |
		[] ---- []
		  []  []
		*/
		// offset allows object to pass by things on right on the side
		const offset = this.width / 4;

		let x1 = 0;
		let x2 = 0;
		let y1 = 0;
		let y2 = 0; 
		let width = this.width / 4;
		let height = this.height / 4;

		switch (dir) {
			case GameUtilities.Direction.NORTH:
				x1 = this.x + offset;
				x2 = this.x + this.width - offset * 2;
				y1 = y2 = this.y;
			break;
			case GameUtilities.Direction.SOUTH:
				x1 = this.x + offset;
				x2 = this.x + this.width - offset * 2;
				y1 = y2 = this.y + this.height;
			break;
			case GameUtilities.Direction.EAST:
				x1 = x2 = this.x + this.width;
				y1 = this.y + offset;
				y2 = this.y + this.height - offset * 2;
			break;
			case GameUtilities.Direction.WEST:
				x1 = x2 = this.x;
				y1 = this.y + offset;
				y2 = this.y + this.height - offset * 2;
			break;
		}

		return {
			x1, x2,
			y1, y2,
			w1: width,
			w2: width,
			h1: height,
			h2: height
		};
	}
}	
