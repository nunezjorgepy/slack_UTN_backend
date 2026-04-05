import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import memberWorkspaceController from "../controllers/member.controller.js";


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


export default memberWorkspaceRouter