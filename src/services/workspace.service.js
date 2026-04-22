import { isValidObjectId } from "mongoose";
import ServerError from "../helpers/error.helper.js";
import workspaceRepository from "../repository/workspace.repository.js";
import memberWorkspaceService from "./memberWorkspace.service.js";
import channelService from "./channel.service.js";
import { createWorkspaceValidations } from "../validations/index.js";


class WorkscapeService {

    async create( user, title, description, url_image ) {
        if (!user || !title) {
            throw new ServerError("Todos los campos son obligatorios", 400)
        }

        // Validaciones del input
        const validation_errors = createWorkspaceValidations({
            title,
            description,
            url_image
        })
        if (validation_errors) {
            throw new ServerError(validation_errors, 400)
        }

        // Si no hay errores, crear el espacio de trabajo
        let workspace = await workspaceRepository.create(title, description, url_image)
        await memberWorkspaceService.create(
            user.id,
            workspace._id,
            'owner',
            true,
            undefined
        )
        // Crea canal por defecto
        const channel = await channelService.create(
            workspace._id,
            'Primer canal',
            'Canal generado automáticamente. Podes cambiar el nombre y la descripción si lo deseas.'
        )

        return { workspace, channel }
    }

    async getById(workspace_id) {
        if (!workspace_id) {
            throw new ServerError("Debe proporcionar un id", 400)
        }

        // Si la Id no es valida
        if (!isValidObjectId(workspace_id)) {
            throw new ServerError("Id de espacio de trabajo invalida", 400)
        }

        // Agregar la lista de miembros
        const workspace = await workspaceRepository.getById(workspace_id)

        // Si el espacio no existe
        if (!workspace) {
            throw new ServerError("El espacio de trabajo no existe", 404)
        }

        // Si el espacio esta inactivo
        if (!workspace.isActive) {
            throw new ServerError("El espacio de trabajo esta inactivo", 400)
        }

        return workspace

    }

    async getActiveByUserID(user_id) {
        if (!user_id) {
            throw new ServerError("Debe proporcionar un id", 400)
        }
        return await workspaceRepository.getActiveByUserID(user_id)
    }

    async edit( workspace_id, title, description, url_image ) {
        if (!workspace_id || !title) {
            throw new ServerError("Todos los campos son obligatorios", 400)
        }

        // Validaciones del input
        const validation_errors = createWorkspaceValidations({
            title,
            description,
            url_image
        })
        if (validation_errors) {
            throw new ServerError(validation_errors, 400)
        }

        // Si no hay errores, editar el espacio de trabajo
        const edited_workspace = await workspaceRepository.edit(
            workspace_id,
            title,
            description,
            url_image
        )
        return edited_workspace

    }

    async softDelete(workspace_id) {
        if (!workspace_id) {
            throw new ServerError("Debe proporcionar un id", 400)
        }

        await workspaceRepository.softDelete(workspace_id)
    }
}

const workspaceService = new WorkscapeService()

export default workspaceService