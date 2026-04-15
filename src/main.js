import ENVIRONMENT from "./config/environment.config.js"
import connectMongoDB from "./config/mongoDB.config.js"
import express from 'express';
import healthRouter from "./routes/health.router.js"
import authRouter from "./routes/auth.router.js"
import cors from 'cors'
import authMiddleware from "./middlewares/authMiddleware.js"
import workspaceRouter from "./routes/workspace.router.js"
import memberWorkspaceRouter from "./routes/member.router.js";
import channelRouter from "./routes/channel.router.js";
import errorHandlerMiddleware from "./middlewares/errorHandlerMiddleware.js";
import ServerError from "./helpers/error.helper.js";


connectMongoDB()


const app = express()


app.use(cors())

app.use(express.json())


/* 
Delegamos las consultas que vengan sobre '/api/health' al healthRouter
*/
app.use('/api/health', healthRouter)
app.use('/api/auth', authRouter)
app.use('/api/workspace', workspaceRouter)
app.use('/api/membersWorkspace', memberWorkspaceRouter)
app.use('/api/channel', channelRouter)

app.get(
    '/api/test', 
    authMiddleware, 
    (request, response, next) => {
        try {
            const {user} = request
            if (true) {
                return next(new ServerError("Error interno X", 400))
            }
            response.send('ok, vos sos: ' + user.id)
        } catch (error) {
            next(error)
        }
    }
)

// Siempre debe estar al final de todos los endpoints
app.use(
    errorHandlerMiddleware
)

app.listen(
    ENVIRONMENT.PORT, 
    () => {
        console.log('La aplicacion se esta escuchando en el puerto ' + ENVIRONMENT.PORT)
    }
)