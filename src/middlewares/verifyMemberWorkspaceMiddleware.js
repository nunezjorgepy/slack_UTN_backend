import ServerError from "../helpers/error.helper.js"
import workspaceMemberRepository from "../repository/member.repository.js"
import mongoose from "mongoose"


function verifyMemberWorkspaceMiddleware(valid_roles = []) {
    /**
     * @param {Array<String>} valid_roles - Roles válidos para acceder al recurso
     * @returns {Function} - Middleware que verifica si el usuario es miembro del workspace
     */
    return async function (req, res, next) {
        const { user, workspace } = req

        if (!workspace) {
            throw new ServerError('No se proporcionó el espacio de trabajo', 400)
        }

        if (!user) {
            throw new ServerError('No se proporcionó el usuario', 400)
        }

        // Verifico si es una id valida
        if (!mongoose.Types.ObjectId.isValid(workspace._id)) {
            throw new ServerError('No se proporcionó una id valida', 400)
        }

        try {
            const member = await workspaceMemberRepository.getUserById(user.id, workspace._id)

            if (!member) {
                throw new ServerError('El usuario no es miembro del workspace', 404)
            }

            if (member.acceptInvitation === 'rejected' || member.acceptInvitation === 'pending') {
                throw new ServerError('El usaurio no aceptó la invitación', 401)
            }

            if (!member.isActive && member.acceptInvitation === 'accepted') {
                throw new ServerError('El miembro se fue del espacio. Pedir otra invitación.', 401)
            }

            // Si el role no es válido
            if (valid_roles.length > 0 && !valid_roles.includes(member.role)) {
                throw new ServerError('El usuario no tiene permiso para realizar esta acción', 403)
            }

            req.member = member
            next()
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

export default verifyMemberWorkspaceMiddleware