import * as THREE from "three"
import GLTFLoader from "three-gltf-loader"
import promisifyLoader from "./promisifyLoader.js"

// TODO: replace ItemLoad and ModelLoader by a single function
// (to load an object, using regexp on properties to check for "path" (modelPath, animPath, etc.))
// and use loaders accordingly
const ModelLoader = (manager) => {
    const load = (path, onLoad, onProgress, onError) => {
        const gltfLoader = promisifyLoader(new GLTFLoader(manager), onProgress)

        // ⬇⬇⬇ returns the gltf.scene.children as a single Object3D
        // (Group or the only child as it is (could be Mesh or other maybe))
        function returnGltfAsObject3D(gltf) {
            if (
                !(
                    gltf.scene &&
                    gltf.scene.children &&
                    gltf.scene.children.length > 0
                )
            ) {
                throw `gltf has no child inside "scene", or a wrong structure`
            } else {
                const group = new THREE.Group()
                if (gltf.scene.children.length == 1) {
                    group.add(gltf.scene.children[0])
                    return group
                } else if (gltf.scene.children.length > 1) {
                    for (let i = gltf.scene.children.length - 1; i >= 0; i--) {
                        group.add(gltf.scene.children[i])
                    }
                    return group
                }
            }
        }

        gltfLoader
            .load(path)
            .then(
                // onLoad
                (gltf) => {
                    gltf = returnGltfAsObject3D(gltf)

                    if (!(gltf instanceof THREE.Object3D))
                        throw `The gltf to be resolved is not an instanceof THREE.Object3D`

                    onLoad(gltf)
                }
            )
            .catch((err) => {
                onError(err)
                console.error(`Could not load model from path:`, path)
            })
    }

    return Object.assign(new THREE.Loader(manager), {
        load
    })
}

export default ModelLoader
