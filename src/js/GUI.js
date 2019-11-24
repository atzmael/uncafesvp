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

  const addStagedItem = (item, name) => {
    if (name == null) {
      if (item.name) name = item.name
      else
        throw "Can't add GUI folder without a name (add on Item.model or in function's arguments)"
    }
    folders[name] = datGui.addFolder(name)
    folder = folders[name]
    //   folder.add(Item, "visible")
    const positionFolder = folder.addFolder("basePosition")
    positionFolder.add(item._basePos, "x", -10, 10)
    positionFolder.add(item._basePos, "y", -10, 10)
    positionFolder.add(item._basePos, "z", -10, 10)
    const rotationFolder = folder.addFolder("rotation")
    rotationFolder.add(item.model.rotation, "x", -6.2831853071, 6.2831853071)
    rotationFolder.add(item.model.rotation, "y", -6.2831853071, 6.2831853071)
    rotationFolder.add(item.model.rotation, "z", -6.2831853071, 6.2831853071)
  }

  // const addAnimationColors = (animPlane) => {
  //   addColorUniform(
  //     { hexColor: animPlane.hexColor1 },
  //     animPlane.material.uniforms.col1
  //   )
  //   addColorUniform(
  //     { hexColor: animPlane.hexColor1 },
  //     animPlane.material.uniforms.col1
  //   )
  //   addColorUniform(
  //     { hexColor: animPlane.hexColor1 },
  //     animPlane.material.uniforms.col1
  //   )
  // }

  const addColorUniform = (object, uniform, folder = datGui) => {
    folder.addColor(object, "hexColor").onChange((c) => {
      const rgbColor = new THREE.Color(c)
      uniform.value = rgbColor
    })
  }

  return Object.assign(datGui, {
    addObject3D,
    addStagedItem,
    // addAnimationColors,
    addColorUniform
  })
}

export default GUI()
