import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.js";


const memberWorkspaceRouter = Router()

memberWorkspaceRouter.get(
    '/active',
    authMiddleware,
    (req, res) => {
        console.log(`Trae los espacios activos de ${req.user.name}`)
        res.status(200).json(
            {
                ok: true,
                message: "Espacios activos obtenidos exitosamente."
            }
        )
    }
)


export default memberWorkspaceRouter