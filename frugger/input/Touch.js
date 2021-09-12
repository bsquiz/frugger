class Touch extends InputMethod {
	constructor() {
		super();

		this.$rightBtn = document.getElementById('rightBtn');
		this.$leftBtn = document.getElementById('leftBtn');
		this.$upBtn = document.getElementById('upBtn');
		this.$downBtn = document.getElementById('downBtn');
		this.InputCodeToKeyCode = {};
	}
	init(InputCode) {
		this.InputCodeToKeyCode[InputCode.UP] = 'upButton';
		this.InputCodeToKeyCode[InputCode.DOWN] = 'downButton';
		this.InputCodeToKeyCode[InputCode.LEFT] = 'leftButton';
		this.InputCodeToKeyCode[InputCode.RIGHT] = 'rightButton';
		this.InputCodeToKeyCode[InputCode.A] = '';
		this.InputCodeToKeyCode[InputCode.B] = '';

                const $buttons = document.getElementById('directionButtons');

		$buttons.addEventListener('mousedown', e => {
			this.pressKey(id);
		});

		$buttons.addEventListener('mouseup', e => {
			const id = e.target.id;
			this.releaseKey(id);
		});
	}
};
