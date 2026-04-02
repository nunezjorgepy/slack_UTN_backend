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
}

const workspaceService = new WorkscapeService()

export default workspaceService