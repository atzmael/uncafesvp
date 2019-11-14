import * as dat from "dat.gui"
import * as THREE from "three"
import AssetLoader from "./AssetLoader.js"

const datGui = new dat.GUI()

const GUI = () => {
	const folders = []
	let folder

	const addObject3D = (object, name) => {
		if (name == null) {
			if (object.name) name = object.name
			else
				throw "Can't add GUI folder without a name (add on object or in function's arguments)"
		}
		folders[name] = datGui.addFolder(name)
		if (object.type == "light") {
			folders[name].add(object, "color")
		} else if (object instanceof THREE.Object3D) {
			folder = folders[name]
			//   folder.add(object, "visible")
			const positionFolder = folder.addFolder("position")
			positionFolder.add(object.position, "x", -10, 10)
			positionFolder.add(object.position, "y", -10, 10)
			positionFolder.add(object.position, "z", -10, 10)
			const rotationFolder = folder.addFolder("rotation")
			rotationFolder.add(object.rotation, "x")
			rotationFolder.add(object.rotation, "y")
			rotationFolder.add(object.rotation, "z")
		}
	}

	const debuggingLoader = AssetLoader()

	const switchAsset = (assetName, path) => {
		debuggingLoader.load(path, assetName)
		// TODO: use a store (check svelte doc)
	}

	return {
		addObject3D,
		switchAsset
	}
}

export default GUI()
