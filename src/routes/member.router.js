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

memberWorkspaceRouter.post(
    '/response-to-invitation',
    authMiddleware,
    verifyWorkspaceMiddleware,      // Este es necesario porque si el owner llegó a eliminar el espacio de trabajo, no se podrá responder a la invitación
    verifyMemberWorkspaceMiddleware(),
    memberWorkspaceController.responseToInvitation
)

memberWorkspaceRouter.delete(
    '/:member_id',
    authMiddleware,
    verifyWorkspaceMiddleware,
    verifyMemberWorkspaceMiddleware(),
    memberWorkspaceController.deleteMember
)

memberWorkspaceRouter.put(
    '/:member_id',
    authMiddleware,
    verifyWorkspaceMiddleware,
    verifyMemberWorkspaceMiddleware(),
    memberWorkspaceController.modifyRole
)


export default memberWorkspaceRouter