import { isValidObjectId } from "mongoose";
import ServerError from "../helpers/error.helper.js";
import workspaceRepository from "../repository/workspace.repository.js";
import memberWorkspaceService from "./memberWorkspace.service.js";


class WorkscapeService {

    async create( user, title, description, url_image ) {
        if (!user || !title) {
            throw new ServerError("Todos los campos son obligatorios", 400)
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

    async getOne(workspace_id) {
        if (!workspace_id) {
            throw new ServerError("Debe proporcionar un id", 400)
        }

        // Si la Id no es valida
        if (!isValidObjectId(workspace_id)) {
            throw new ServerError("Id de espacio de trabajo invalida", 400)
        }

        try {
            // Agregar la lista de miembros
            const workspace = await workspaceRepository.getById(workspace_id)

            // Si el espacio no existe
            if (!workspace) {
                throw new ServerError("El espacio de trabajo no existe", 404)
            }

            return workspace
        } catch (error) {
            throw error
        }
    }

    async getOnlyActive() {
        try {
            return await workspaceRepository.getOnlyActive()
        } catch (error) {
            throw error
        }
    }

    async edit( workspace_id, title, description, url_image ) {
        if (!workspace_id || !title || !description || !url_image) {
            throw new ServerError("Todos los campos son obligatorios", 400)
        }
        try {
            return await workspaceRepository.edit(
                workspace_id,
                title,
                description,
                url_image
            )
            
        } catch (error) {
            throw error
        }
    }

    async softDelete(workspace_id) {
        if (!workspace_id) {
            throw new ServerError("Debe proporcionar un id", 400)
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