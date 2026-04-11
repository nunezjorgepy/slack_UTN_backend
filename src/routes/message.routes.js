import { Router } from "express"
// Middlewares
import authMiddleware from "../middlewares/authMiddleware.js"
import verifyWorkspaceMiddleware from "../middlewares/verifyWorkspaceMiddleware.js"
import verifyMemberWorkspaceMiddleware from "../middlewares/verifyMemberWorkspaceMiddleware.js"
import verifyChannelMiddleware from "../middlewares/verifyChannelMiddleware.js"


const messageRouter = Router({
    mergeParams: true
})

messageRouter.use(
    authMiddleware,
    verifyWorkspaceMiddleware,
)

messageRouter.post(
    '/',
    verifyMemberWorkspaceMiddleware(),
    verifyChannelMiddleware,
    /* messageController.create */
    (req, res) => {
        res.send('Message created')
    }
)

messageRouter.get(
    '/',
    verifyMemberWorkspaceMiddleware(),
    verifyChannelMiddleware,
    /* messageController.getAll */
    (req, res) => {
        res.send('Message list')
    }
)

export default messageRouter