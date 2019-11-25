import { writable } from 'svelte/store'

// TODO: this is global, but should be encapsulated inside the laoder class (check: SmartLoader)
export const isLoaded = writable(false)
export const loadingPercentage = writable(0)
