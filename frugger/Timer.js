class Timer {
	constructor(max, shouldLoop = false, updateDelay = 0) {
		this._isRunning = false;
		this._MAX_TIMER = max;
		this._timer = 0;
		this._shouldLoop = shouldLoop;
		this._MAX_UPDATE_DELAY_TIMER = updateDelay;
		this._updateDelayTimer = 0;
	}
	getMaxTime() {
		return this._MAX_TIMER;
	}
	getTime() {
		return this._timer;
	}
	setUpdateDelay(delay) {
		this._MAX_UPDATE_DELAY_TIMER = delay;
	}
	isRunning() {
		return this._isRunning;
	}
	start() {
		this._timer = 0;
		this._isRunning = true;
	}
	stop() {
		this._isRunning = false;
	}
	resume() {
		this._isRunning = true;
	}
	update() {
		let shouldUpdate = true;

		if (!this._isRunning) {
			return false;
		}
		
		if (this._MAX_UPDATE_DELAY_TIMER > 0) {
			shouldUpdate = false;
			this._updateDelayTimer++;

			if (this._updateDelayTimer >= this._MAX_UPDATE_DELAY_TIMER) {
				this._updateDelayTimer = 0;
				shouldUpdate = true;
			} 
		}

		if (!shouldUpdate) return true;

		this._timer++;
		if (this._timer === this._MAX_TIMER) {
			if (this._shouldLoop) {
				this.start();
				return false;
			} else {
				this.stop();
				return false;
			}
		}

		return true;
	}
}
