import ENVIRONMENT from "../config/environment.config.js"
import ServerError from "../helpers/error.helper.js"
import workspaceMemberRepository from "../repository/member.repository.js"
import memberWorkspaceService from "../services/memberWorkspace.service.js"
import jwt from 'jsonwebtoken'


class MemberWorkspaceController {

    async getMemberList(req, res, next) {
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
            next(error)
        }
    }

    async inviteMember(req, res, next) {
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
            next(error)
        }
    }

    async responseToInvitation(req, res, next) {
        const { response_token } = req.query
        
        try {
            // Si no proporciona el token
            if (!response_token) {
                throw new ServerError('Token de respuesta faltante', 400)
            }
    
            // Extraigo el payload del token
            const payload = jwt.verify(response_token, ENVIRONMENT.JWT_SECRET_KEY)

            const newMember = await memberWorkspaceService.responseToInvitation(
                payload.email,
                payload.newMember_id,
                payload.action
            )

            const message = payload.action === 'accepted' 
                ? "Has aceptado la invitación. Ya podes acceder al espacio de trabajo."
                : "Has rechazado la invitación al espacio de trabajo."      /* IMPORTANTE: si cambio este mensaje, también lo tengo que modificar en el Frontend, en WorkpsaceNotFoundScreen.jsx */
            
            res.status(200).json(
                {
                    ok: true,
                    status: 200,
                    message: message,
                    data: {
                        newMember
                    }
                }
            )
            
        } catch (error) {
            next(error)
        }
    }

    async deleteMember(req, res, next) {
        const { member_id } = req.params
        const workspace = req.workspace
        const member = req.member
        
        try {
            const deletedMember = await memberWorkspaceService.deleteMember(
                member_id,
                member,
                workspace.id
            )
            
            res.status(200).json(
                {
                    ok: true,
                    status: 200,
                    message: "Miembro eliminado.",
                    data: {
                        deletedMember
                    }
                }
            )
            
        } catch (error) {
            next(error)
        }
    }

    async modifyRole(req, res, next) {
        const { member_id } = req.params
        const { role } = req.body
        const member = req.member
        
        try {
            const updatedMember = await memberWorkspaceService.modifyRole(
                member_id,
                member,
                role
            )
            
            res.status(200).json(
                {
                    ok: true,
                    status: 200,
                    message: "Miembro actualizado.",
                    data: {
                        updatedMember
                    }
                }
            )
            
        } catch (error) {
            next(error)
        }
    }
}

const memberWorkspaceController = new MemberWorkspaceController()

export default memberWorkspaceController