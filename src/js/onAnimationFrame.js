import {onDestroy} from "svelte"

let rafID = null
let frameCallbacks = []
let isPlaying = false
let isPaused = false

const pause = () => {
	console.log("PAUSE at frame #" + rafID)
	isPlaying = false
	isPaused = true
	if (rafID != null) {
		cancelAnimationFrame(rafID)
	}
}
const play = frame => {
	// console.log("START PLAYING")
	isPaused = false
	isPlaying = true
	frame()
}
const addToFrameCallbacks = callback => {
	frameCallbacks.push(callback)
}
const frame = () => {
	frameCallbacks.forEach(callback => {
		callback()
	})
	rafID = requestAnimationFrame(frame)
	// console.log("frame : ", rafID)
}

export default function onAnimationFrame(callback) {
	addToFrameCallbacks(callback)

	if (!isPlaying && !isPaused) {
		play(frame) // initial play call
	}

	onDestroy(() => {
		frameCallbacks = []
		pause()
	})
}
