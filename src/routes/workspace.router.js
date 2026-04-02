/* 
GET /api/workspace 
Trae todos los espacios de trabajo asociado al usuario
Para saber que espacios de trabajo traer NECESITAMOS EL ID DEL USUARIO
*/

import {Router} from 'express'
import workspaceController from '../controllers/workspace.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import checkOwnerMiddleware from '../middlewares/checkOwnerMiddleware.js'

const workspaceRouter = Router()

workspaceRouter.get(
    '/',
    authMiddleware,
    workspaceController.getWorkspaces
)

workspaceRouter.post(
    '/create',
    authMiddleware,
    workspaceController.create
)

workspaceRouter.delete(
    '/:workspace_id',
    authMiddleware,
    checkOwnerMiddleware,
    (req, res) => {
        return res.status(200).json({
            ok: true,
            status: 200,
            message: "Espacio eliminado con éxito"
        })
    }
)

export default workspaceRouter