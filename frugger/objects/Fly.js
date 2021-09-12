class Fly extends GameObject {
	constructor() {
		super(0, 0, GameUtilities.Direction.NORTH);
		this.type = GameUtilities.PickupType.FLY;
	}
}
