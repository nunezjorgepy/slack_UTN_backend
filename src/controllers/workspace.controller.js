import ServerError from "../helpers/error.helper.js"
import workspaceMemberRepository from "../repository/member.repository.js"
import workspaceService from "../services/workspace.service.js"

class WorkspaceController {
    async getWorkspaces(request, response) {
        try {
            //Cliente consultante
            const user = request.user

            //Traer la lista de espacios de trabajo asociados al usuario
            const workspaces = await workspaceMemberRepository.getWorkspaceListByUserId(user.id)
            response.json(
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

    async create(request, response) {
        try {
            const { title, description, url_image = '' } = request.body
            const user = request.user
            await workspaceService.create(
                user,
                title,
                description,
                url_image
            )

            response.status(201).json(
                {
                    ok: true,
                    status: 201,
                    message: 'Espacio de trabajo creado'
                }
            )
        } catch (error) {
            //Errores esperables en el sistema
            if (error instanceof ServerError) {
                return response.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            else {
                console.error('Error inesperado en el registro', error)
                return response.status(500).json(
                    {
                        ok: false,
                        status: 500,
                        message: "Internal server error"
                    }
                )
            }
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