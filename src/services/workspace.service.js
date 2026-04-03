import ServerError from "../helpers/error.helper.js";
import workspaceRepository from "../repository/workspace.repository.js";
import memberWorkspaceService from "./memberWorkspace.service.js";


class WorkscapeService {

    async create( user, title, description, url_image ) {
        if (!user || !title) {
            throw new ServerError("Todos los campos son obligatorios", 404)
        }
        try {
            const workspace_created = await workspaceRepository.create(title, description, url_image)
            await memberWorkspaceService.create(
                user.id,
                workspace_created._id,
                'owner'
            )

            return workspace_created
        } catch (error) {
            throw error
        }
    }

    async softDelete(workspace_id) {
        if (!workspace_id) {
            throw new ServerError("Debe proporcionar un id", 401)
        }

        try {
            await workspaceRepository.softDelete(workspace_id)
        } catch (error) {
            throw error
        }
    }
}

const workspaceService = new WorkscapeService()

export default workspaceService