import messageService from "../services/message.service.js"


class MessageController {
    async create(req, res, next) {
        try {
            const { content } = req.body
            const user = req.user
            const channel_id = req.params.channel_id

            const message = await messageService.create(user.id, channel_id, content.trim())

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
            next(error)
        }
    }
}

const messageController = new MessageController()

export default messageController