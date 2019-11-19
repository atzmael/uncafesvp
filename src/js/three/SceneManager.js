import * as THREE from "three"
import BgPlane from "./BgPlane.js"
import StagedItem from "./StagedItem.js"
import GUI from "../GUI.js"
import Stats from "stats.js/src/Stats"

const SceneManager = (canvas) => {
  let width = canvas.parentNode.offsetWidth // assuming canvas width: 100%
  let height = canvas.parentNode.offsetHeight // assuming canvas height: 100%

  var stats = Stats()
  stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom)

  const buildRenderer = ({ width, height }) => {
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

  const renderer = buildRenderer({ width, height })
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

  const updateAssets = (assets) => {
    // TODO: clean this part : for example : create an AssetDispatcher
    assets.forEach((asset) => {
      if (asset instanceof THREE.Object3D) {
        // TODO: this pushes a new stagedItem every time assets are updated, even if it already exists in the array
        if (asset.name == "gobelet") {
          GUI.addObject3D(asset)
          stagedItems.push(
            StagedItem(asset, scene, camera, {
              position: new THREE.Vector3(1, 0, 0)
              // TODO: use stage option
            })
          )
        } else if (asset.name == "lait") {
          GUI.addObject3D(asset)
          stagedItems.push(
            StagedItem(asset, scene, camera, {
              position: new THREE.Vector3(-1, 0, 0)
              // TODO: use stage option
            })
          )
        } else {
          console.warn(
            "This asset didn't match any name in the if statements : ",
            asset
          )
        }
      }
      if (asset.name == "maptest") bgPlane.setTexture(asset)
      if (asset.name == "anim") {
        asset.image.play()
        const animPlaneGeo = new THREE.PlaneBufferGeometry(4, 4, 1)
        const animPlaneMat = new THREE.MeshBasicMaterial({ map: asset })
        const animPlane = new THREE.Mesh(animPlaneGeo, animPlaneMat)
        scene.add(animPlane)
      }
    })
  }

  const changeXpStage = (newXpStage) => {
    console.warn("TODO: threejs logic when the xpStage changes")
  }

  const onCanvasResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    bgPlane.onCanvasResize(camera)
    stagedItems.forEach((item) => item.onCanvasResize())
    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  const update = (time) => {
    stats.begin()
    // monitored code goes here

    bgPlane.update()
    stagedItems.forEach((item) => item.update(time))

    stats.end()
    renderer.render(scene, camera)
  }

  return {
    onCanvasResize,
    changeXpStage,
    updateAssets,
    update
  }
}

export default SceneManager
