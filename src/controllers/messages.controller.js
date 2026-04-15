import ServerError from "../helpers/error.helper.js"
import messageService from "../services/message.service.js"


class MessageController {
    async create(req, res, next) {
        try {
            const { content } = req.body
            const user = req.user
            const channel_id = req.params.channel_id

            const message = await messageService.create(user.id, channel_id, content)

            return res.status(201).json(
                {
                    ok: true,
                    status: 201,
                    message: 'Mensaje creado exitosamente',
                    data: {
                        message
                    }
                }
            )
        } catch (error) {
            next(error)
        }
    }

    async getAll(req, res, next) {
        try {
            const channel_id = req.params.channel_id

            const messages = await messageService.getAll(channel_id)

            return res.status(200).json(
                {
                    ok: true,
                    status: 200,
                    message: 'Mensajes obtenidos exitosamente',
                    data: {
                        messages
                    }
                }
            )
        } catch (error) {
            if (error instanceof ServerError) {
                return res.status(error.status).json(
                    {
                        ok: false,
                        status: error.status,
                        message: error.message
                    }
                )
            }
            else {
                console.error('Error inesperado en el registro', error)
                return res.status(500).json(
                    {
                        ok: false,
                        status: 500,
                        message: "Internal server error"
                    }
                )
            }
        }
    }
}

const messageController = new MessageController()

export default messageController