import ServerError from "../helpers/error.helper.js"
import memberWorkspaceService from "../services/memberWorkspace.service.js"


class MemberWorkspaceController {

    async getActiveWorkspacesByUserId(req, res) {
        const user = req.user
        
        try {
            if(!user) {
                throw new ServerError('Todos los campos son obligatorios', 400)
            }

            const activeUserWorkspaces = await memberWorkspaceService.getActiveWorkspacesByUserId(user.id)
            
            res.status(200).json(
                {
                    ok: true,
                    status: 200,
                    message: "Espacios obtenidos.",
                    data: {
                        activeUserWorkspaces
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

    async getMemberList(req, res) {
        const workspace_id = req.params.workspace_id
        
        try {
            if(!workspace_id) {
                throw new ServerError('Todos los campos son obligatorios', 400)
            }

            const memberList = await memberWorkspaceService.getMemberList(workspace_id)
            
            res.status(200).json(
                {
                    ok: true,
                    status: 200,
                    message: "Lista de miembros obtenida.",
                    data: {
                        memberList
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

    async addMember(req, res) {
        const { fk_id_user, role } = req.body
        const fk_id_workspace = req.params.workspace_id
        
        try {
            if(!fk_id_user || !fk_id_workspace || !role) {
                throw new ServerError('Todos los campos son obligatorios', 400)
            }

            const newMember = await memberWorkspaceService.addMember(
                fk_id_user,
                fk_id_workspace,
                role
            )
            
            res.status(200).json(
                {
                    ok: true,
                    status: 200,
                    message: "Miembro agregado.",
                    data: {
                        newMember
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
}

const memberWorkspaceController = new MemberWorkspaceController()

export default memberWorkspaceController