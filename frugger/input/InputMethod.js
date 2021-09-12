class InputMethod {
	constructor() {
		this.inputsActive = new Map();
		this.inputsReleased = new Map();
	}
	getAllInputsReleased() {
		const values = Array.from(
			this.inputsActive,
			(([name, value]) => value)
		);

		return values.filter(value => value === true)
			.length === 0;
	}
	reset() {
		this.inputsActive.forEach((val, key) => {
			this.inputsActive.set(key, false);
		});
	}
	resetReleasedInputs() {
		this.inputsReleased.forEach((val, key) => {
			this.inputsReleased.set(key, false);
		});
	}
	pressKey(keyId) {
		this.inputsActive.set(keyId, true);
		this.inputsReleased.set(keyId, false);
	}
	releaseKey(keyId) {
		this.inputsActive.set(keyId, false);
		this.inputsReleased.set(keyId, true);
	}
	init(InputCode) {
	}
}
