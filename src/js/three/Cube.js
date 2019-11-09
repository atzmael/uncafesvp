import * as THREE from "three"

const Cube = (width = 1, height = 1, depth = 1, color = 0xff00ff) => {
    const geometry = new THREE.BoxBufferGeometry(width, height, depth)
    const material = new THREE.MeshBasicMaterial({ color: color })
    let mesh = new THREE.Mesh(geometry, material)
    mesh.name = "testCube"
    return { mesh }
}

export default Cube
