const SoundHandler = () => {
	const play = (type, sound) => {
		switch(type) {
			case "once":
				if(sound.isPlaying) {
					sound.stop();
					sound.play();
				} else {
					sound.play();
				}
				break;
			case "loop":
				loopSound(sound);
				break;
		}
	};
	const stop = (type, sound) => {
		switch(type) {
			case "once":
				sound.stop();
				break;
			case "loop":
				sound.setLoop(false);
				break;
		}
	};

	const checkSoundTimeline = (globalTime, soundTime, sound) => {
		sound.play();
	};
	const loopSound = (sound) => {
		sound.setLoop(true);
		checkSoundTimeline(1, 2, sound);
	};

	return {
		play,
		stop
	}
};

export default SoundHandler;