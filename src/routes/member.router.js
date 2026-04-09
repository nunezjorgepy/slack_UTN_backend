import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import memberWorkspaceController from "../controllers/member.controller.js";
import verifyMemberWorkspaceMiddleware from "../middlewares/verifyMemberWorkspaceMiddleware.js";

// TODO: creo que lo mejor va a ser rehacer todas las rutas para que coincidan con el modelo de datos
// TODO: middleware que verifique si el usuario ya es parte del espacio
const memberWorkspaceRouter = Router()

/* 
TODO DELETE: eliminar si todo funciona como corresponde
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
    '/add',
    authMiddleware,
    verifyMemberWorkspaceMiddleware(['owner']),
    memberWorkspaceController.addMember
) 
*/


export default memberWorkspaceRouter