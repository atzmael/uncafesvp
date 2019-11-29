import {gsap} from "gsap";

const SoundHandler = () => {

	let volume = {value: 0};

	const play = (type, audio, offset = 0) => {
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
					transition(audio, 1);
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
	const stop = (type, audio, offset = 0) => {
		switch (type) {
			case "once":
				audio.stop();
				break;
			case "loop":
				transition(audio, 0);
				break;
		}
	};

	const transition = (audio, value) => {
		volume.value = audio.getVolume();
		gsap.killTweensOf(volume);
		gsap.to(volume, {
			value: value, onUpdate: () => {
				audio.setVolume(volume.value);
			}
		})
	}

	const initSound = (buffer, name, audio) => {
		audio.setBuffer(buffer);
		audio.setVolume(0);
		audio.name = name;
	}

	return {
		play,
		stop,
		initSound,
		volume
	}
};

export default SoundHandler;