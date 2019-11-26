const SoundHandler = () => {

	const play = (type, audio) => {
		switch(type) {
			case "once":
				if(audio.isPlaying) {
					audio.stop();
					audio.play();
				} else {
					audio.play();
				}
				break;
			case "loop":
				audio.setLoop(true);
				audio.play();
				break;
		}
	};
	const stop = (type, audio) => {
		switch(type) {
			case "once":
				audio.stop();
				break;
			case "loop":
				audio.setLoop(false);
				audio.stop();
				break;
		}
	};

	const initSound = (buffer, name, audio) => {
		audio.setBuffer(buffer);
		audio.name = name;
	}

	return {
		play,
		stop,
		initSound
	}
};

export default SoundHandler;