import ServerError from "../helpers/error.helper.js"
import channelRepository from "../repository/channel.repository.js"
import workspaceMemberRepository from "../repository/member.repository.js"
import workspaceService from "../services/workspace.service.js"

class WorkspaceController {
    async create(req, res) {
        try {
            const { title, description = '', url_image = '' } = req.body
            const user = req.user
            const workspace = await workspaceService.create(
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
                        workspace
                    }
                }
            )
        } catch (error) {
            //Errores esperables en el sistema
            if (error instanceof ServerError) {
                return res.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            else {
                console.error('Error inesperado en el registro', error)
                return res.status(500).json(
                    {
                        ok: false,
                        status: 500,
                        message: "Internal server error"
                    }
                )
            }
        }
    }

    async getById(req, res) {
        /**
         * Descripción: Obtiene un espacio de trabajo por su ID y la lista de miembros
         * @param {string} workspace_id - ID del espacio de trabajo
         * @returns {JSON} - Espacio de trabajo
         */
        const { workspace_id } = req.params
        try {
            const workspace = await workspaceService.getById(workspace_id)
            const members = await workspaceMemberRepository.getMemberList(workspace_id)
            const channels = await channelRepository.getAll(workspace_id)

            res.json(
                {
                    ok: true,
                    status: 200,
                    message: 'Espacio de trabajo obtenido',
                    data: {
                        workspace,
                        members,
                        channels
                    }
                }
            )
        } catch (error) {
            if (error instanceof ServerError) {
                return res.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            else {
                console.error('Error inesperado en el registro', error)
                return res.status(500).json(
                    {
                        ok: false,
                        status: 500,
                        message: "Internal server error"
                    }
                )
            }
        }
    }
    async getWorkspaces(req, res) {
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
            //Errores esperables en el sistema
            if (error instanceof ServerError) {
                return res.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            else {
                console.error('Error inesperado en el registro', error)
                return res.status(500).json(
                    {
                        ok: false,
                        status: 500,
                        message: "Internal server error"
                    }
                )
            }
        }
    }

    async getOnlyActive(req, res) {
        try {
            const workspaces = await workspaceService.getOnlyActive()
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
            throw error
        }
    }

    async edit(req, res) {
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
            throw error
        }
    }

    async softDelete(req, res) {
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
            if (error instanceof ServerError) {
                return res.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            else {
                console.error('Error inesperado en el registro', error)
                return res.status(500).json(
                    {
                        ok: false,
                        status: 500,
                        message: "Internal server error"
                    }
                )
            }
        }
    }
}

const workspaceController = new WorkspaceController()

export default workspaceController