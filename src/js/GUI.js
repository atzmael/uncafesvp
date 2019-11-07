import * as dat from "dat.gui"

const GUI = () => {
    const datGui = new dat.GUI()

    const folders = []
    let folder

    const addMeshToGui = (object, folderName = undefined) => {
        addFolder(object.name)
        if (object.type == "light") {
            folders[object.name].add(object, "color")
        } else if (object.type == "Mesh") {
            folder = folders[object.name]
            folder.add(object, "visible")
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
