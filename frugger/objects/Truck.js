class Truck extends Car {
	constructor(x, y, dir) {
		super(x, y, dir);
		this.type = GameUtilities.EnemyType.TRUCK;
		this.width = GameUtilities.TILE_WIDTH * 2;
	}
}
