game.Input = {
	Mode: {
		KEYBOARD: 0,
		GAMEPAD: 1,
		TOUCH: 2
	},
	mode: 0,
	InputCode: {
		UP: 0,
		RIGHT: 1,
		DOWN: 2,
		LEFT: 3,
		A: 4,
		B: 5,
		X: 6,
		Y: 7
	},
	keyboard: {},
	gamepad: {},
	touch: {},
	$debugButtons: document.getElementById('debugButtons'),
	getInputState(input, state) {
		let inputActive = false;

		if (this.mode === this.Mode.KEYBOARD) {
			inputActive = this.keyboard[state].get(
				this.keyboard.InputCodeToKeyCode[input]
			);
		} else if (this.mode === this.Mode.TOUCH) {
			inputActive = this.touch[state].get(
				this.touch.InputCodeToKeyCode[input]
			);
		} else {
			this.gamepad.update();
			inputActive = this.gamepad[state].get(
				this.gamepad.InputCodeToButtonCode[input]
			);
		}

		return inputActive;

	},
	reset() {
		this.keyboard.reset();
		this.gamepad.reset();
	},
	resetReleasedInputs() {
		this.keyboard.resetReleasedInputs();
		this.gamepad.resetReleasedInputs();
		this.touch.resetReleasedInputs();
	},
	getInputActive(input) {
		return this.getInputState(input, 'inputsActive');
	},
 	getInputReleased(input) {
		return this.getInputState(input, 'inputsReleased');
	},
	getAllInputsReleased(input) {
		switch (this.mode) {
			case this.Mode.KEYBOARD:
				return this.keyboard.getAllInputsReleased();
			break;
			case this.Mode.GAMEPAD:
				return this.gamepad.getAllInputsReleased();
			break;
			case this.Mode.TOUCH:
				return this.touch.getAllInputsReleased();
			break;
			default: break;
		}
	},
	debug() {
		this.$a.innerHTML = this.getInputActive(this.InputCode.A);
		this.$b.innerHTML = this.getInputActive(this.InputCode.B);
		this.$up.innerHTML = this.getInputActive(this.InputCode.UP);
		this.$down.innerHTML = this.getInputActive(this.InputCode.DOWN);
		this.$left.innerHTML = this.getInputActive(this.InputCode.LEFT);
		this.$right.innerHTML = this.getInputActive(this.InputCode.RIGHT);
	},
	init() {
		/*
		this.$a = this.$debugButtons.getElementsByClassName('a-button')[0];
		this.$b= this.$debugButtons.getElementsByClassName('b-button')[0];
		this.$up= this.$debugButtons.getElementsByClassName('up-button')[0];
		this.$down= this.$debugButtons.getElementsByClassName('down-button')[0];
		this.$left= this.$debugButtons.getElementsByClassName('left-button')[0];
		this.$right= this.$debugButtons.getElementsByClassName('right-button')[0];
		*/
		this.keyboard = new Keyboard();
		this.gamepad = new Gamepad();
		this.touch = new Touch();

		this.keyboard.init(this.InputCode);
		this.gamepad.init(this.InputCode);
		this.touch.init(this.InputCode);
	}
};
