import { writable, derived } from "svelte/store"

const defaultStageIndex = 0
const stageNames = [
    "home",
    "intro",
    "choice1",
    "transition1",
    "choice2",
    "transition2",
    "choice3",
    "transition3",
    "choice4",
    "transition4",
    "break",
    "climax",
    "outro"
]

let currentIndexStage = 0

const createStage = () => {
    const xpStageIndex = writable(defaultStageIndex)
    const { subscribe, set, update } = xpStageIndex

    // Debug purpose only
    const next = () =>
        update((indx) => {
            currentIndexStage = indx
            return Math.min(indx + 1, stageNames.length - 1)
        })
    const previousDebug = () =>
        update((indx) => {
            if (soundsPlaying.length > 0) {
                let stopSound = soundsPlaying.pop()
                stopSound.soundHandler.stop("loop", stopSound.sound)
            }
            currentIndexStage = indx
            return Math.max(indx - 1, 0)
        })
    const previous = () => {
        if (soundsPlaying.length > 0) {
            let stopSound = soundsPlaying.pop()
            stopSound.soundHandler.stop("loop", stopSound.sound)
        }
    }
    const setIndex = (x) => {
        if (x < currentIndexStage) {
            previous()
        }
        currentIndexStage = x
        set(Math.min(Math.max(x, 0), stageNames.length - 1))
    }
    const setName = (str) => {
        const newIndex = stageNames.indexOf(str)
        if (newIndex < currentIndexStage) {
            previous()
        }
        if (newIndex === -1) throw `Could not find "${str}" in stageNames array`
        else {
            currentIndexStage = newIndex
            set(newIndex)
        }
    }
    const reset = () => set(defaultStageIndex)

    return {
        subscribe, // $xpStageIndex
        next,
        previousDebug,
        setIndex,
        setName,
        reset
    }
}

// Usage raycast
export const objectToInteract = []

// usage : song construction
export const soundsPlaying = []
export const soundsWaiting = []
export const songTiming = { value: 0, duration: 5.23 }

// usage : $xpStageIndex or xpStage.method()
export const xpStageIndex = createStage()
// usage : $xpStageName
export const xpStageName = derived(xpStageIndex, ($index) => stageNames[$index])

// ----TODO: put didUserInteract in its own store file (?)
// usage : $didUserInteract to get value, didUserInteract.set( __ ) to set value
// usefull to know if we can play media <video> or <audio>
export const didUserInteract = writable(false)
