const SoundHandler = () => {

	const play = (type, audio) => {
		switch (type) {
			case "once":
				if (audio.isPlaying) {
					audio.stop();
					audio.play();
				} else {
					audio.play();
				}
				break;
			case "playloop":
				if (audio.isPlaying) {
					audio.setVolume(1);
				} else {
					console.warn(`SoundHandler|${audio.name} : loop is not playing, be sure to load it`);
				}
				break;
			case "loadloop":
				audio.setVolume(0);
				audio.play();
				audio.setLoop(true);
				break;
		}
	};
	const stop = (type, audio) => {
		switch (type) {
			case "once":
				audio.stop();
				break;
			case "loop":
				audio.setVolume(0);
				break;
		}
	};

	const initSound = (buffer, name, audio) => {
		audio.setBuffer(buffer);
		audio.setVolume(0);
		audio.name = name;
	}

	return {
		play,
		stop,
		initSound
	}
};

export default SoundHandler;