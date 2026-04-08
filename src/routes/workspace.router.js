/* 
GET /api/workspace 
Trae todos los espacios de trabajo asociado al usuario
Para saber que espacios de trabajo traer NECESITAMOS EL ID DEL USUARIO
*/

import {Router} from 'express'
import workspaceController from '../controllers/workspace.controller.js'
import authMiddleware from '../middlewares/authMiddleware.js'
import verifyMemberWorkspaceMiddleware from '../middlewares/verifyMemberWorkspaceMiddleware.js'
import verifyWorkspaceMiddleware from '../middlewares/verifyWorkspaceMiddleware.js'
import channelRouter from './channel.router.js'

const workspaceRouter = Router()

workspaceRouter.get(
    '/',
    authMiddleware,
    workspaceController.getWorkspaces
)

workspaceRouter.get(
    '/active',
    authMiddleware,
    workspaceController.getOnlyActive
)

workspaceRouter.get(
    '/:workspace_id',
    authMiddleware,
    verifyWorkspaceMiddleware,
    verifyMemberWorkspaceMiddleware(),
    workspaceController.getById
)

workspaceRouter.post(
    '/create',
    authMiddleware,
    workspaceController.create
)

workspaceRouter.post(
    '/edit/:workspace_id',
    authMiddleware,
    verifyWorkspaceMiddleware,
    verifyMemberWorkspaceMiddleware(['owner']),
    workspaceController.edit
)

workspaceRouter.delete(
    '/:workspace_id',
    authMiddleware,
    verifyWorkspaceMiddleware,
    verifyMemberWorkspaceMiddleware(['owner']),
    workspaceController.softDelete
)

workspaceRouter.use(
    '/:workspace_id/channel', 
    channelRouter
)

export default workspaceRouter