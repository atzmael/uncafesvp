import * as dat from "dat.gui";

const gui = () => {
	window.gui = new dat.GUI();

	const gui = window.gui;

	const folders = [];
	let folder;

	const addMeshToGui = (object, folderName = undefined) => {
		addFolder(object.name);
		if(object.type == "light") {
			folders[object.name].add(object, 'color');
		} else if(object.type == "Mesh") {
			folder = folders[object.name];
			folder.add(object, 'visible');
		}
	};

	const addFolder = (name) => {
		folders[name] = gui.addFolder(name);
	};

	return {
		addMeshToGui,
		addFolder
	}
};

export default gui();