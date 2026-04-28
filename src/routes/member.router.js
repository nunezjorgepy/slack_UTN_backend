import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import memberWorkspaceController from "../controllers/member.controller.js";
import verifyMemberWorkspaceMiddleware from "../middlewares/verifyMemberWorkspaceMiddleware.js";
import verifyWorkspaceMiddleware from "../middlewares/verifyWorkspaceMiddleware.js";
import ROLE_CONSTANTS from "../constants/roles.constants.js";

// TODO: creo que lo mejor va a ser rehacer todas las rutas para que coincidan con el modelo de datos
// TODO: middleware que verifique si el usuario ya es parte del espacio
const memberWorkspaceRouter = Router({
    mergeParams: true
})

memberWorkspaceRouter.post(
    '/invite',
    authMiddleware,
    verifyWorkspaceMiddleware,
    verifyMemberWorkspaceMiddleware([ROLE_CONSTANTS.OWNER, ROLE_CONSTANTS.ADMIN]),
    memberWorkspaceController.inviteMember
)

memberWorkspaceRouter.patch(
    '/response-to-invitation',
    authMiddleware,
    memberWorkspaceController.responseToInvitation
)

memberWorkspaceRouter.delete(
    '/:member_id',
    authMiddleware,
    verifyWorkspaceMiddleware,
    verifyMemberWorkspaceMiddleware(),
    memberWorkspaceController.deleteMember
)

memberWorkspaceRouter.patch(
    '/:member_id',
    authMiddleware,
    verifyWorkspaceMiddleware,
    verifyMemberWorkspaceMiddleware([ROLE_CONSTANTS.OWNER, ROLE_CONSTANTS.ADMIN]),
    memberWorkspaceController.modifyRole
)


export default memberWorkspaceRouter