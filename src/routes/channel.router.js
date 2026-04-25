import {Router} from 'express'
import channelController from '../controllers/channel.controller.js'

// Middlewares
import authMiddleware from '../middlewares/authMiddleware.js'
import verifyWorkspaceMiddleware from '../middlewares/verifyWorkspaceMiddleware.js'
import verifyMemberWorkspaceMiddleware from '../middlewares/verifyMemberWorkspaceMiddleware.js'
import verifyChannelMiddleware from '../middlewares/verifyChannelMiddleware.js'
import ROLE_CONSTANTS from '../constants/roles.constants.js'

// Routers
import messageRouter from './message.routes.js'

const channelRouter = Router({
    mergeParams: true
})

channelRouter.post(
    '/',
    authMiddleware,
    verifyWorkspaceMiddleware,
    verifyMemberWorkspaceMiddleware([ROLE_CONSTANTS.OWNER, ROLE_CONSTANTS.ADMIN]),
    channelController.create
)

channelRouter.get(
    '/',
    authMiddleware,
    verifyWorkspaceMiddleware,
    verifyMemberWorkspaceMiddleware(),
    channelController.getAll
)

channelRouter.get(
    '/:channel_id',
    authMiddleware,
    verifyWorkspaceMiddleware,
    verifyMemberWorkspaceMiddleware(),
    verifyChannelMiddleware,
    channelController.getById
    // TODO: preguntar si, como ya consigo el channel en el middleware, hace falta la función del controller
)

channelRouter.patch(
    '/:channel_id',
    authMiddleware,
    verifyWorkspaceMiddleware,
    verifyMemberWorkspaceMiddleware([ROLE_CONSTANTS.OWNER, ROLE_CONSTANTS.ADMIN]),
    verifyChannelMiddleware,
    channelController.update
)

channelRouter.delete(
    '/soft-delete/:channel_id',
    authMiddleware,
    verifyWorkspaceMiddleware,
    verifyMemberWorkspaceMiddleware([ROLE_CONSTANTS.OWNER]),
    verifyChannelMiddleware,
    channelController.softDelete
)

channelRouter.delete(
    '/delete/:channel_id',
    authMiddleware,
    verifyWorkspaceMiddleware,
    verifyMemberWorkspaceMiddleware([ROLE_CONSTANTS.OWNER]),
    verifyChannelMiddleware,
    channelController.delete
)

channelRouter.use(
    '/:channel_id/message',
    messageRouter
)

export default channelRouter