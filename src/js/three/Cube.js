import * as THREE from "three"

const Cube = (width = 1, height = 1, depth = 1, color = 0xffffff) => {
    const geometry = new THREE.BoxBufferGeometry(width, height, depth)
    const material = new THREE.MeshBasicMaterial({ color: color })
    return new THREE.Mesh(geometry, material)
}

export default Cube
