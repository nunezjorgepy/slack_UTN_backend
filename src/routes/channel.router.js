/* 
Creo los enpoints para los canales:
    - POST /:workspace_id/channel
    - GET /:workspace_id/channels
    - GET /:workspace_id/channel/:channel_id
    - DELETE /:workspace_id/channel/:channel_id

Opcional: un PUT /:workspace_id/channel/:channel_id para editar el canal.
*/

import {Router} from 'express'
import channelController from '../controllers/channel.controller.js'

// Middlewares
import authMiddleware from '../middlewares/authMiddleware.js'
import verifyWorkspaceMiddleware from '../middlewares/verifyWorkspaceMiddleware.js'
import verifyMemberWorkspaceMiddleware from '../middlewares/verifyMemberWorkspaceMiddleware.js'

const channelRouter = Router()

channelRouter.post(
    '/:workspace_id/channel',
    authMiddleware,
    verifyWorkspaceMiddleware,
    verifyMemberWorkspaceMiddleware(['owner', 'admin']),
    channelController.create
)

channelRouter.get(
    '/:workspace_id/channels',
    authMiddleware,
    verifyWorkspaceMiddleware,
    verifyMemberWorkspaceMiddleware(),
    /* channelController.getAll */
    (req, res) => {
        res.send('Getting all channels')
    }
)

channelRouter.get(
    '/:workspace_id/channel/:channel_id',
    authMiddleware,
    verifyWorkspaceMiddleware,
    verifyMemberWorkspaceMiddleware(),
    /* channelController.getById */
    (req, res) => {
        res.send('Getting channel by id')
    }
)

channelRouter.delete(
    '/:workspace_id/channel/:channel_id',
    authMiddleware,
    verifyWorkspaceMiddleware,
    verifyMemberWorkspaceMiddleware(['owner', 'admin']),
    /* channelController.delete */
    (req, res) => {
        res.send('Channel deleted')
    }
)

export default channelRouter