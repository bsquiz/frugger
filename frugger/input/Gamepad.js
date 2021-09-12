class Gamepad extends InputMethod {
	constructor() {
		super();
		this.ButtonCode = {
			UP: 0,
			DOWN: 1,
			LEFT: 2,
			RIGHT: 3,
			A: 4,
			B: 5
		}; 
		this.buttonCodeKeys = ['UP', 'DOWN', 'LEFT', 'RIGHT'];
		this.gamepads = [];
		this.InputCodeToButtonCode = {};
		this.DIRECTIONAL_BUTTON = 7;
	}
	gamepadHandler(event, connecting) {
		var gamepad = event.gamepad;
		// Note:
		// gamepad === navigator.getGamepads()[gamepad.index]

		if (connecting) {
			this.gamepads[gamepad.index] = gamepad;
		} else {
			delete this.gamepads[gamepad.index];
		}
	}
	isDirectionalButton(buttonKey) {
		return this.buttonCodeKeys.includes(buttonKey);
	}
	isDirectionalButtonActive(buttonCode) {
		if (this.gamepads.length === 0) return false;

		const gamepad = this.gamepads[0];

		if (buttonCode === this.ButtonCode.UP) {
			return gamepad.axes[2] === -1;
		} else if (buttonCode === this.ButtonCode.DOWN) {
			return gamepad.axes[2] === 1;
		} else if (buttonCode === this.ButtonCode.LEFT) {
			return gamepad.axes[1] === -1;
		} else if (buttonCode === this.ButtonCode.RIGHT) {
			return gamepad.axes[1] === 1;
		}
		return false;
	}
	isActionButtonActive(buttonCode) {
		if (this.gamepads.length === 0) return false;

		const gamepad = this.gamepads[0];

		if (buttonCode === this.ButtonCode.A) {
			return gamepad.buttons[0].pressed;
		} else if (buttonCode === this.ButtonCode.B) {
			return gamepad.buttons[1].pressed;
		}

		return false;
	}	
	update() {
		const keys = Object.keys(this.ButtonCode);

		keys.forEach(buttonLabel => {
			const buttonCode = this.ButtonCode[buttonLabel];

			if (this.isDirectionalButton(buttonLabel)) {
				// First see if input was pressed last update
				// and released on this update.
				this.inputsReleased.set(buttonCode,
					(this.inputsActive.get(buttonCode))
					&& this.isDirectionalButtonActive(buttonCode));

				this.inputsActive.set(buttonCode,
					this.isDirectionalButtonActive(buttonCode));
			} else {
				this.inputsReleased.set(buttonCode,
					(this.inputsActive.get(buttonCode))
					 && this.isActionButtonActive(buttonCode))

				this.inputsActive.set(buttonCode,
					this.isActionButtonActive(buttonCode));
			}
		});
	}
	init(InputCode) {
		this.InputCodeToButtonCode[InputCode.UP] = this.ButtonCode.UP;
		this.InputCodeToButtonCode[InputCode.DOWN] = this.ButtonCode.DOWN;
		this.InputCodeToButtonCode[InputCode.LEFT] = this.ButtonCode.LEFT;
		this.InputCodeToButtonCode[InputCode.RIGHT] = this.ButtonCode.RIGHT;
		this.InputCodeToButtonCode[InputCode.A] = this.ButtonCode.A;
		this.InputCodeToButtonCode[InputCode.B] = this.ButtonCode.B;

		window.addEventListener("gamepadconnected", (e) => {
			console.log("Gamepad connected at index %d: %s. %d buttons, %d axes.",
			e.gamepad.index, e.gamepad.id,
			e.gamepad.buttons.length, e.gamepad.axes.length);
			this.gamepadHandler(e, true);
		}, false);

		window.addEventListener("gamepaddisconnected", (e) => {
			console.log("Gamepad disconnected from index %d: %s",
					e.gamepad.index, e.gamepad.id);
			this.gamepadHandler(e, false);
		}, false);
	}
};
