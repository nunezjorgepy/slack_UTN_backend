import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import memberWorkspaceController from "../controllers/member.controller.js";
import checkOwnerMiddleware from "../middlewares/checkOwnerMiddleware.js";


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
    checkOwnerMiddleware,
    memberWorkspaceController.addMember
)


export default memberWorkspaceRouter