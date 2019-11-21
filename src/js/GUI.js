import * as dat from "dat.gui"
import * as THREE from "three"
// import AssetLoader from "./AssetLoader.js"

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
      rotationFolder.add(object.rotation, "x", -6.2831853071, 6.2831853071)
      rotationFolder.add(object.rotation, "y", -6.2831853071, 6.2831853071)
      rotationFolder.add(object.rotation, "z", -6.2831853071, 6.2831853071)
    }
  }

  const addStagedItem = (stagedItem, name) => {
    console.log(stagedItem)
    if (name == null) {
      if (stagedItem.model.name) name = stagedItem.model.name
      else
        throw "Can't add GUI folder without a name (add on stagedItem.model or in function's arguments)"
    }
    folders[name] = datGui.addFolder(name)
    folder = folders[name]
    //   folder.add(stagedItem, "visible")
    const positionFolder = folder.addFolder("basePosition")
    positionFolder.add(stagedItem.basePos, "x", -10, 10)
    positionFolder.add(stagedItem.basePos, "y", -10, 10)
    positionFolder.add(stagedItem.basePos, "z", -10, 10)
    const rotationFolder = folder.addFolder("rotation")
    rotationFolder.add(stagedItem.model.rotation, "x", -6.2831853071, 6.2831853071)
    rotationFolder.add(stagedItem.model.rotation, "y", -6.2831853071, 6.2831853071)
    rotationFolder.add(stagedItem.model.rotation, "z", -6.2831853071, 6.2831853071)
  }

  return {
    addObject3D,
    addStagedItem
  }
}

export default GUI()
