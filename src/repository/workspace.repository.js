/* 
Crear la class WorkspaceRepository con los sig metodos:
- create()
- daleteById()
- getById()
- updateById()
*/

import WorkspaceModel from "../models/workspace.model.js";
class WorkspaceRepository {
    // TODO: Documentar

    async create(title, description, url_image) {
        return await WorkspaceModel.create({
            title: title,
            description: description,
            url_image,
        })
    };
    
}
const workspaceRepository = new WorkspaceRepository()
export default workspaceRepository;
