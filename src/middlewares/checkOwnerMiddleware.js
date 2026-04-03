import ServerError from "../helpers/error.helper.js"
import workspaceRepository from "../repository/workspace.repository.js"
import memberWorkspaceService from "../services/memberWorkspace.service.js"

async function checkOwnerMiddleware(req, res, next){
    try {
        /**
         * Description: Revisa si el usuario que intenta eliminar el workspace es el dueño (owner). Probablemente algo un poco más realista sea que también pueda ser eliminado por el dueño de la página.
         * 
         */
        const user = req.user
        const { workspace_id } = req.params
    
        // Verifico que estén todos los campos requerios
        if (!user || !workspace_id) {
            throw new ServerError("Faltan datos", 400)
        }

        // Verifico que el espacio exista
        const workspace = await workspaceRepository.getById(workspace_id)
        if (!workspace) {
            throw new ServerError("El espacio de trabajo no existe", 404)
        }
    
        // Busco el owner
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