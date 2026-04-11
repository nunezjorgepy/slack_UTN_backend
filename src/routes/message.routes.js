import { Router } from "express"
// Middlewares
import authMiddleware from "../middlewares/authMiddleware.js"
import verifyWorkspaceMiddleware from "../middlewares/verifyWorkspaceMiddleware.js"
import verifyMemberWorkspaceMiddleware from "../middlewares/verifyMemberWorkspaceMiddleware.js"
import verifyChannelMiddleware from "../middlewares/verifyChannelMiddleware.js"
import messageController from "../controllers/messages.controller.js"


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
    messageController.create
)

messageRouter.get(
    '/',
    verifyMemberWorkspaceMiddleware(),
    verifyChannelMiddleware,
    messageController.getAll
)

export default messageRouter