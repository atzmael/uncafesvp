import {writable, derived} from "svelte/store"

const defaultStageIndex = 0;
const stageNames = [
	"home",
	"intro",
	"choice1",
	"choice2",
	"choice3",
	"break",
	"climax",
	"outro"
];

const createStage = () => {
	const xpStageIndex = writable(defaultStageIndex)
	const {subscribe, set, update} = xpStageIndex

	const next = () => update((indx) => Math.min(indx + 1, stageNames.length - 1))
	const previous = () => update((indx) => Math.max(indx - 1, 0))
	const setIndex = (x) => set(Math.min(Math.max(x, 0), stageNames.length - 1))
	const setName = (str) => {
		const newIndex = stageNames.indexOf(str)
		if (newIndex === -1) throw `Could not find "${str}" in stageNames array`
		else set(newIndex)
	}
	const reset = () => set(defaultStageIndex)

	return {
		subscribe, // $xpStageIndex
		next,
		previous,
		setIndex,
		setName,
		reset,
		objectToInteract
	}
}

// Usage raycast
export const objectToInteract = [];

// usage : $xpStageIndex or xpStage.method()
export const xpStageIndex = createStage()
// usage : $xpStageName
export const xpStageName = derived(xpStageIndex, ($index) => stageNames[$index])

// ----TODO: put didUserInteract in its own store file (?)
// usage : $didUserInteract to get value, didUserInteract.set( __ ) to set value
// usefull to know if we can play media <video> or <audio>
export const didUserInteract = writable(false)
