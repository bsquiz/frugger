game.audio = {
	soundFiles: [
		'audio/jump.mp3',
		'audio/goal.mp3'
	],
	sounds: {},
	load() {
		this.soundFiles.forEach(snd => {
			const $el = document.createElement('audio');
			this.sounds[snd.split('/')[1].split('.')[0]] = $el;
			$el.onload = function() {
				console.log(snd + ' loaded');
			};
			$el.canplaythrough = function() {
				console.log('error');
			};
			$el.src = snd;
		});	
	},
	playSound(sound) {
		sound.play();
	}
}
