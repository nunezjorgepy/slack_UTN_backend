import ENVIRONMENT from "../config/environment.config.js"
import ServerError from "../helpers/error.helper.js"
import memberWorkspaceService from "../services/memberWorkspace.service.js"
import jwt from 'jsonwebtoken'


class MemberWorkspaceController {

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

    async inviteMember(req, res) {
        const { email, role } = req.body
        const workspace = req.workspace
        const member_email = req.user.email
        
        try {
            if(!email || !workspace || !role) {
                throw new ServerError('Todos los campos son obligatorios', 400)
            }

            const newMember = await memberWorkspaceService.inviteMember(
                email,
                workspace,
                role,
                member_email
            )
            
            res.status(200).json(
                {
                    ok: true,
                    status: 200,
                    message: "Miembro invitado.",
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

    async responseToInvitation(req, res) {
        const { token } = req.query
        const user_email = req.user.email
        
        try {
            // Si no proporciona el token
            if (!token) {
                throw new ServerError('Token faltante', 400)
            }
    
            // Extraigo el payload del token
            const payload = jwt.verify(token, ENVIRONMENT.JWT_SECRET_KEY)

            const newMember = await memberWorkspaceService.responseToInvitation(
                payload.email,
                payload.newMember_id,
                payload.action,
                user_email
            )
            
            res.status(200).json(
                {
                    ok: true,
                    status: 200,
                    message: "Miembro invitado.",
                    data: {
                        newMember
                    }
                }
            )
            
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                return res.status(401).json(
                    {
                        ok: false,
                        status: 401,
                        message: "Token inválido o expirado"
                    }
                )
            }
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