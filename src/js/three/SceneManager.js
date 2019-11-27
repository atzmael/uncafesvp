import * as THREE from "three"
import BgPlane from "./BgPlane.js"
import StagedItem from "./StagedItem.js"
import GUI from "../GUI.js"
import Stats from "stats.js/src/Stats"
import {xpStageIndex, objectToInteract, soundsPlaying, soundsWaiting, currentStageName} from "../stores/xpStageStore"

const SceneManager = (canvas) => {
	let width = canvas.parentNode.offsetWidth // assuming canvas width: 100%
	let height = canvas.parentNode.offsetHeight // assuming canvas height: 100%

	let stats = Stats()
	stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
	document.body.appendChild(stats.dom)

	// Raycast settings
	let raycaster = new THREE.Raycaster()
	let mouse = new THREE.Vector2()
	let isRaycasting = false;

	const buildRenderer = ({width, height}) => {
		const renderer = new THREE.WebGLRenderer({
			canvas: canvas,
			antialias: true,
			alpha: true
		})
		const DPR = window.devicePixelRatio ? window.devicePixelRatio : 1
		renderer.setPixelRatio(DPR)
		renderer.setSize(width, height)
		renderer.gammaInput = true
		renderer.gammaOutput = true
		return renderer
	}

	const buildLights = () => {
		const lightGroup = new THREE.Group()

		const ambiLight = new THREE.AmbientLight(0xffffff, 0.2)
		lightGroup.add(ambiLight)

		const hemiLight = new THREE.HemisphereLight(0xff0000, 0x0000aa, 0.4)
		lightGroup.add(hemiLight)
		const hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 3)
		hemiLight.add(hemiLightHelper)
		GUI.addObject3D(hemiLight, "hemiLight") // TODO: find a way to modify hemilight in a sensible manner

		return lightGroup
	}

	const renderer = buildRenderer({width, height})
	const scene = new THREE.Scene()
	const camera = new THREE.PerspectiveCamera(
		45,
		window.innerWidth / window.innerHeight,
		1,
		1000
	)
	camera.position.z = 18

	const stagedItems = []

	const lightGroup = buildLights()
	scene.add(lightGroup)

	let bgPlane = BgPlane()
	scene.add(bgPlane.mesh)

	// Sound vars
	const audioListener = new THREE.AudioListener()
	camera.add(audioListener)
	scene.add(camera)
	let songTime = 0

	const addItems = (items) => {
		items.forEach((item) => {
			const stagedItem = StagedItem(item, camera, audioListener)
			stagedItems.push(stagedItem)
			scene.add(stagedItem.collider)
			objectToInteract.push(stagedItem.collider)
			GUI.addStagedItem(stagedItem)
		})
	}

	const addTextures = (textures) => {
		// textures.forEach((texture) => {
		//     if (texture.name == "maptestTexture") bgPlane.setTexture(texture)
		// })
	}

	const addVideoTextures = (vts) => {
		vts.forEach((vt) => {
			if (vt.name == "animtestVideoTexture") {
				bgPlane = BgPlane(vt)
				scene.add(bgPlane.mesh)
				bgPlane.onCanvasResize(camera)
				bgPlane.play()
			}
		})
	}

	const changeXpStage = (newXpStage) => {
		stagedItems.forEach((item) => item.checkIfEnterOrLeave(newXpStage))
	}

	const onCanvasResize = () => {
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
		bgPlane.onCanvasResize(camera)
		stagedItems.forEach((item) => item.onCanvasResize())
		renderer.setSize(window.innerWidth, window.innerHeight)
	}

	const onMouseMove = (event) => {
		mouse.x = (event.clientX / window.innerWidth) * 2 - 1
		mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
	}

	window.addEventListener("mousemove", onMouseMove, false)

	let INTERSECTED = false
	let lastIntersectedObjectName = null
	let objectIntersected = null
	const update = (time) => {
		if(currentStageName == "choice1") isRaycasting = true;
		songTime = time

		// Debug
		stats.begin()

		// RAYCASTING
		raycaster.setFromCamera(mouse, camera)

		var intersects = raycaster.intersectObjects(objectToInteract)

		let lastItem = null
		if (intersects.length > 0 && isRaycasting) {
			if (
				!INTERSECTED ||
				lastIntersectedObjectName != intersects[0].object.name
			) {
				if (null != lastIntersectedObjectName) {
					lastItem = stagedItems.find(
						(elmt) => elmt.name == lastIntersectedObjectName
					)
					lastItem.getBackToPlace()
				}
				objectIntersected = stagedItems.find(
					(elmt) => elmt.name == intersects[0].object.name
				)
				objectIntersected.hasBeenTouched()
				lastIntersectedObjectName = intersects[0].object.name
				INTERSECTED = true
			}
		} else {
			objectIntersected = null
			if (lastIntersectedObjectName != null) {
				lastItem = stagedItems.find(
					(elmt) => elmt.name == lastIntersectedObjectName
				)
				lastItem.getBackToPlace()
			}
			INTERSECTED = false
		}


		if (soundsPlaying.length > 0) {
			soundsPlaying.forEach((e) => {
				if (!e.sound.volume || e.sound.volume == 0) {
					e.soundHandler.play("playloop", e.sound);
				} else {
					console.warn("Sounds are in a loop but can't be played");
				}
			})
		}

		if(soundsWaiting.length > 0) {
			soundsWaiting.forEach(e => {
				if (!e.sound.isPlaying) {
					let calcul = Math.round(songTime % e.sound.buffer.duration * 10) / 10;
					if (calcul == 0) {
						e.soundHandler.play("loadloop", e.sound);
					}
				}
			})
		}

		bgPlane.update(time)
		stagedItems.forEach((item) => item.update(time));

		stats.end()
		renderer.render(scene, camera)
	}

	canvas.addEventListener("click", (e) => {
		e.preventDefault()
		if (null != objectIntersected) {
			soundsPlaying.push(objectIntersected);
			xpStageIndex.next();
		}
	})

	return {
		addItems,
		addTextures,
		addVideoTextures,
		onCanvasResize,
		changeXpStage,
		update
	}
}

export default SceneManager
