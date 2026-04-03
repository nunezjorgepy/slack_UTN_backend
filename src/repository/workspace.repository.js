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

    async edit(workspace_id, title, description, url_image) {
        return await WorkspaceModel.updateOne(
            {
                _id: workspace_id
            },
            {
                title,
                description,
                url_image
            }
        )
    }
    
    async softDelete(workspace_id) {
        return await WorkspaceModel.updateOne(
            {
                _id: workspace_id
            },
            {
                isActive: false
            }
        )
    }
}
const workspaceRepository = new WorkspaceRepository()
export default workspaceRepository;
