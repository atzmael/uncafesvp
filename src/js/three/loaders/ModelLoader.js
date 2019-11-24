import * as THREE from "three"
import GLTFLoader from "three-gltf-loader"

const ModelLoader = (manager) => {
  const gltfLoader = new GLTFLoader(manager)

  const load = ({ path, childArr }, name) => {
    // ⬇⬇⬇ returnGltfAsObject3D is used ONLY if childArr is null
    // (it returns the gltf.scene.children as a single Object3D (Group or the only child as it is (could be Mesh or other maybe)))
    function returnGltfAsObject3D(gltf) {
      if (!(gltf.scene && gltf.scene.children && gltf.scene.children.length > 0)) {
        throw `gltf has no child inside "scene", or a wrong structure`
      } else {
        if (gltf.scene.children.length == 1) {
          return gltf.scene.children[0]
        } else if (gltf.scene.children.length > 1) {
          const group = new THREE.Group()
          for (let i = gltf.scene.children.length - 1; i >= 0; i--) {
            group.add(gltf.scene.children[i])
          }
          return group
        }
      }
    }

    gltfLoader.load(
      path,
      // onLoad
      (gltf) => {
        if (childArr) {
          // this loop searches through the gltf structure and returns the last thing of the childArr
          childArr.forEach((child) => {
            if (gltf[child] == undefined)
              throw `Could not find "${child}" in gltf structure`
            gltf = gltf[child]
          })
        } else {
          gltf = returnGltfAsObject3D(gltf)
        }

        if (!(gltf instanceof THREE.Object3D))
          throw `The gltf to be resolved is not an instanceof THREE.Object3D`

        const gltfAsset = Object.assign(gltf, { name })
        console.log(gltfAsset)
        return gltfAsset
      }
    )
  }

  return Object.assign(new THREE.Loader(manager), {
    load
  })
}

export default ModelLoader

/////////////////
/////////////////
/////////////////
/////////////////
/////////////////
// const loadGLTF = (path, name, childArr) => {
//   return new Promise((resolve, reject) => {
//     gltfLoader.load(
//       path,
//       // onLoaded
//       (gltf) => {
//         if (childArr) {
//           // this loop searches through the gltf structure and returns the last thing of the childArr
//           childArr.forEach((child, index) => {
//             if (gltf[child] == undefined)
//               throw `Could not find "${child}" in gltf structure`
//             gltf = gltf[child]
//           })
//         } else {
//           gltf = returnGltfAsObject3D(gltf)
//         }

//         if (!(gltf instanceof THREE.Object3D))
//           throw `The gltf to be resolved is not an instanceof THREE.Object3D`

//         const addedParams = { name }
//         const gltfAsset = Object.assign(gltf, addedParams)
//         assets.push(gltfAsset)
//         resolve()
//       },
//       // onProgress
//       // (xhr) => console.log(`${name}: ${(xhr.loaded / xhr.total) * 100}%`),
//       undefined,
//       // onError
//       (err) => reject(`Failed to load GLTF with path ${path} : \n ${err}`)
//     )
//   })
// }
