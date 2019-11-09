import * as dat from "dat.gui"

const GUI = () => {
    const datGui = new dat.GUI()

    const folders = []
    let folder

    const addMeshToGui = (object, folderName = object.name) => {
        addFolder(folderName)
        if (object.type == "light") {
            folders[folderName].add(object, "color")
        } else if (object.type == "Mesh") {
            folder = folders[folderName]
            folder.add(object, "visible")
            folder.add(object.position, "x")
            folder.add(object.position, "y")
            folder.add(object.position, "z")
        }
    }

    const addFolder = (name) => {
        folders[name] = datGui.addFolder(name)
    }

    return {
        addMeshToGui,
        addFolder
    }
}

export default GUI()
