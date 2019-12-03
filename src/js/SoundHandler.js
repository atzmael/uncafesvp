import {gsap} from "gsap";
import {xpStageIndex} from "./stores/xpStageStore";

const SoundHandler = () => {

    let volume = {value: 0};
    let frequency = {value: 22050}

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

    const pause = (audio) => {
        let filter = audio.context.createBiquadFilter();

        filter.type = "lowpass"
        audio.setFilter(filter)
        gsap.killTweensOf(frequency);
        gsap.to(frequency, {
            duration: 1.5,
            value: 350,
            onUpdate: () => {
                filter.frequency.value = frequency.value
            },
            onComplete: () => {
                gsap.killTweensOf(volume);
                gsap.to(volume, {
                    duration: 1,
                    value: 0,
                    delay: 1,
                    onUpdate: () => {
                        audio.setVolume(volume.value);
                    },
                    onComplete: () => {
                        audio.stop();
                        xpStageIndex.next();
                    }
                })
            }
        })
    }

    const transition = (audio, value, duration = 0.5) => {
        volume.value = audio.getVolume();
        gsap.killTweensOf(volume);
        gsap.to(volume, {
            duration: duration,
            value: value,
			onUpdate: () => {
                audio.setVolume(volume.value);
            },
			onComplete: () => {
                if(value == 0) audio.stop()
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
        pause,
        initSound,
        volume
    }
};

export default SoundHandler;