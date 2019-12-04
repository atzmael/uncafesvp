import * as THREE from "three"

import vertexShader from "../../glsl/bgPlane.vert"
import fragmentShader from "../../glsl/bgPlane.frag"

import { time } from "../stores/timeStore.js"

import { TweenLite } from "gsap"

/**
 * Background plane that is always billboarded
 * relatively to the active camera,
 */

const BgPlane = ({ bgTextures, noiseTexture }) => {
    const textures = [...bgTextures, noiseTexture]
    textures.forEach((texture) => {
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
    })

    let globalTime = 0
    time.subscribe((t) => (globalTime = t)) // TODO: needs unsubscribe

    const transitionDuration = 5 // in seconds

    const planeGeo = new THREE.PlaneBufferGeometry(1, 1, 1)
    const planeMat = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 1.0 },
            progress: { value: 0.0 },
            bgTexturesFrom: { value: bgTextures[0] },
            bgTexturesTo: { value: bgTextures[1] },
            noiseTexture: { value: noiseTexture }
        },
        vertexShader: vertexShader,
        fragmentShader: fragmentShader
    })

    const onCanvasResize = (camera) => {
        planeMesh.scale.y = Math.min(1, window.innerWidth / window.innerHeight)
        planeMesh.scale.x = Math.max(1, window.innerHeight / window.innerWidth)
        // planeMesh.scale.x *= biggestSide / smallestSide
        // TODO: planeMat.uniforms.aspectRatio.value = camera.aspect
    }

    setInterval(() => {
        TweenLite.fromTo(
            planeMat.uniforms.progress,
            transitionDuration,
            { value: 0 },
            {
                value: 1,
                onStart: () => {
                    planeMat.uniforms.bgTexturesFrom.value =
                        bgTextures[
                            Math.floor(globalTime / transitionDuration - 1) %
                                bgTextures.length
                        ]
                    planeMat.uniforms.bgTexturesTo.value =
                        bgTextures[
                            Math.floor(globalTime / transitionDuration) %
                                bgTextures.length
                        ]
                }
            }
        )
    }, transitionDuration * 1000)

    const update = (time) => {
        planeMat.uniforms.time.value = time
        // planeMat.uniforms.progress.value = Math.max(
        //     0,
        //     Math.min(1, (time / transitionDuration) % 1)
        // )
    }

    const planeMesh = new THREE.Mesh(planeGeo, planeMat)

    planeMesh.name = "bgPlane" // needed for GUI
    planeMesh.renderOrder = -1
    planeMesh.material.depthTest = false
    onCanvasResize()

    return {
        mesh: planeMesh,
        onCanvasResize,
        update
    }
}

export default BgPlane
