import {gsap} from "gsap";

const SoundHandler = () => {

    let volume = {value: 0};

    const play = (type, audio, offset = 0) => {
        switch (type) {
			case "playloop":
				audio.offset = offset;
				audio.play();
                transition(audio, 1, offset);
                break;
            case "loadloop":
                audio.setVolume(0);
                audio.setLoop(true);
                break;
        }
    };
    const stop = (type, audio) => {
        switch (type) {
            case "loop":
                transition(audio, 0);
                break;
        }
    };

    const transition = (audio, value) => {
        volume.value = audio.getVolume();
        gsap.killTweensOf(volume);
        gsap.to(volume, {
            value: value,
			onUpdate: () => {
                audio.setVolume(volume.value);
            },
			onComplete: () => {
            	if(value == 0) {
            		audio.stop();
				}
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