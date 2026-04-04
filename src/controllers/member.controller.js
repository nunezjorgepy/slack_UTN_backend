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
            throw error
        }
    }
}

const memberWorkspaceController = new MemberWorkspaceController()

export default memberWorkspaceController