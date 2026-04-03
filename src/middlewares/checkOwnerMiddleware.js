import ServerError from "../helpers/error.helper.js"
import memberWorkspaceService from "../services/memberWorkspace.service.js"

async function checkOwnerMiddleware(req, res, next){
    try {
        /**
         * Description: Revisa si el usuario que intenta eliminar el workspace es el dueño (owner). Probablemente algo un poco más realista sea que también pueda ser eliminado por el dueño de la página.
         * 
         * @param {Object} req - Request object
         * @param {Object} res - Response object
         * @param {Function} next - Next middleware function
         * @returns {Function} - Next middleware function
         */
        const user = req.user
        const { workspace_id } = req.params
    
    
        if (!user || !workspace_id) {
            throw new ServerError("Faltan datos", 400)
        }
    
        const foundOwner = await memberWorkspaceService.findOwnerByUserAndWorkspaceId(
            user,
            workspace_id
        )
    
        // Si no se encuentra el owner o no tiene autorización
        if (!foundOwner || foundOwner.length === 0) {
            throw new ServerError("No tenes autorización", 401)
        }
    
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

export default checkOwnerMiddleware