class Bulldozer extends Car {
	constructor(x, y, dir) {
		super(x, y, dir);
		this.type = GameUtilities.EnemyType.BULLDOZER;
	}
}
