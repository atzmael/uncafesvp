import { readable } from "svelte/store"
import onAnimationFrame from "../onAnimationFrame.js"
import * as THREE from "three"

const clock = new THREE.Clock()

export const time = readable(0, function start(set) {
  onAnimationFrame(() => {
    set(clock.getElapsedTime())
  })
  return () => {
    console.log("no more subscriber")
  }
})
