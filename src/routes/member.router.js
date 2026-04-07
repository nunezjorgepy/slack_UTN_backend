import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import memberWorkspaceController from "../controllers/member.controller.js";
import verifyMemberWorkspaceMiddleware from "../middlewares/verifyMemberWorkspaceMiddleware.js";


const memberWorkspaceRouter = Router()

memberWorkspaceRouter.get(
    '/active',
    authMiddleware,
    memberWorkspaceController.getActiveWorkspacesByUserId
)

memberWorkspaceRouter.get(
    '/list/:workspace_id',
    authMiddleware,
    memberWorkspaceController.getMemberList
)

memberWorkspaceRouter.post(
    '/:workspace_id/add',
    authMiddleware,
    verifyMemberWorkspaceMiddleware(['owner']),
    memberWorkspaceController.addMember
)


export default memberWorkspaceRouter