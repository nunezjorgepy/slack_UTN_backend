import ServerError from "../helpers/error.helper.js"
import channelRepository from "../repository/channel.repository.js"
import workspaceMemberRepository from "../repository/member.repository.js"
import workspaceService from "../services/workspace.service.js"

class WorkspaceController {
    async create(req, res, next) {
        try {
            const { title, description = '(Sin descripción)', url_image = '' } = req.body
            const user = req.user
            const {workspace, channel} = await workspaceService.create(
                user,
                title,
                description,
                url_image
            )

            res.status(201).json(
                {
                    ok: true,
                    status: 201,
                    message: 'Espacio de trabajo creado',
                    data: {
                        workspace,
                        channel_id: channel.channel_id
                    }
                }
            )
        } catch (error) {
            next(error)
        }
    }

    async getById(req, res, next) {
        /**
         * Descripción: Obtiene un espacio de trabajo por su ID y la lista de miembros
         * @param {string} workspace_id - ID del espacio de trabajo
         * @returns {JSON} - Espacio de trabajo
         */
        const { workspace_id } = req.params
        try {
            const workspace = await workspaceService.getById(workspace_id)
            const members = await workspaceMemberRepository.getActiveMemberList(workspace_id)
            const channels = await channelRepository.getAll(workspace_id)

            res.json(
                {
                    ok: true,
                    status: 200,
                    message: 'Espacio de trabajo obtenido',
                    data: {
                        workspace,
                        members,
                        channels,
                        member_logged: req.member
                    }
                }
            )
        } catch (error) {
            next(error)
        }
    }
    async getWorkspaces(req, res, next) {
        try {
            //Cliente consultante
            const user = req.user

            //Traer la lista de espacios de trabajo asociados al usuario
            const workspaces = await workspaceMemberRepository.getWorkspaceListByUserId(user.id)
            res.json(
                {
                    ok: true, 
                    status: 200,
                    message: 'Espacios de trabajo obtenidos',
                    data: {
                        workspaces
                    }
                }
            )
        }
        catch (error) {
            next(error)
        }
    }

    async getActiveByUserID(req, res, next) {
        try {
            const user = req.user
            const workspaces = await workspaceService.getActiveByUserID(user.id)
            res.json(
                {
                    ok: true,
                    status: 200,
                    message: 'Espacios de trabajo obtenidos',
                    data: {
                        workspaces
                    }
                }
            )
        } catch (error) {
            next(error)
        }
    }

    async edit(req, res, next) {
        const { workspace_id } = req.params
        const { title, description = '', url_image = '' } = req.body

        try {
            await workspaceService.edit(
                workspace_id,
                title,
                description,
                url_image
            )

            res.status(200).json(
                {
                    ok: true,
                    status: 200,
                    message: "Espacio editado exitósamente."
                }
            )
        } catch (error) {
            next(error)
        }
    }

    async softDelete(req, res, next) {
        const { workspace_id } = req.params

        try {
            await workspaceService.softDelete(workspace_id)

            res.status(200).json(
                {
                    ok: true,
                    status: 200,
                    message: "Espacio eliminado exitosamente."
                }
            )
        } catch (error) {
            next(error)
        }
    }
}

const workspaceController = new WorkspaceController()

export default workspaceController