import ServerError from "../helpers/error.helper.js"
import workspaceMemberRepository from "../repository/member.repository.js"


function verifyMemberWorkspaceMiddleware(valid_roles = []) {
    return async function (req, res, next) {
        const { user } = req
        const { workspace_id } = req.params

        if (!workspace_id) {
            throw new ServerError('No se proporcionó el espacio de trabajo', 400)
        }

        if (!user) {
            throw new ServerError('No se proporcionó el usuario', 400)
        }

        try {
            const member = await workspaceMemberRepository.getUserById(user.id, workspace_id)

            if (!member) {
                throw new ServerError('El usuario no es miembro del workspace', 404)
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