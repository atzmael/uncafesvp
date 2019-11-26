const SoundHandler = () => {
	const play = (type, sound) => {
		switch(type) {
			case "once":
				if(!sound.isPlaying) sound.play();
				break;
			case "loop":
				loopSound(sound);
				break;
		}
	};
	const stop = (sound) => {
		sound.stop();
	}
	const checkSoundTimeline = (globalTime, soundTime, sound) => {
		sound.play();
	};
	const loopSound = (sound) => {
		sound.setLoop(true);
		checkSoundTimeline(1, 2, sound);
	}

	return {
		play,
		stop
	}
};

export default SoundHandler;