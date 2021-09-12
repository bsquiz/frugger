class Keyboard extends InputMethod { 
	constructor() {
		super();
		this.KeyCode = {
			LEFT: 37,
			RIGHT: 39,
			UP: 38,
			DOWN: 40,
			SPACE: 32,
			SHIFT: 16
		};
		this.InputCodeToKeyCode = {};
	}
	init(InputCode) {
		this.InputCodeToKeyCode[InputCode.UP] = this.KeyCode.UP;
		this.InputCodeToKeyCode[InputCode.DOWN] = this.KeyCode.DOWN;
		this.InputCodeToKeyCode[InputCode.LEFT] = this.KeyCode.LEFT;
		this.InputCodeToKeyCode[InputCode.RIGHT] = this.KeyCode.RIGHT;
		this.InputCodeToKeyCode[InputCode.A] = this.KeyCode.SPACE;
		this.InputCodeToKeyCode[InputCode.B] = this.KeyCode.SHIFT;

		document.addEventListener('keydown', e => {
			this.pressKey(e.keyCode);
		});
		document.addEventListener('keyup', e => {
			this.releaseKey(e.keyCode);
		});
	}
}
