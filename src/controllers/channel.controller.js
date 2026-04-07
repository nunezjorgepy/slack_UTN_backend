import ServerError from "../helpers/error.helper.js"
import channelService from "../services/channel.service.js"


class ChannelController {
    async create(req, res) {
        try {
            const workspace = req.workspace
            const { name, description } = req.body

            const channel = await channelService.create(workspace._id, name, description)
            
            res.status(201).json(
                {
                    ok: true,
                    status: 201,
                    message: 'Canal creado exitosamente',
                    data: {
                        channel
                    }
                }
            )
        } catch (error) {
            //Errores esperables en el sistema
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

    async getAll(req, res) {
        try {
            const workspace = req.workspace
            const channels = await channelService.getAll(workspace._id)
            
            res.status(200).json(
                {
                    ok: true,
                    status: 200,
                    message: 'Canales obtenidos exitosamente',
                    data: {
                        channels
                    }
                }
            )
        } catch (error) {
            //Errores esperables en el sistema
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

    async getById(req, res) {
        try {
            const { workspace, channel } = req
            console.log(workspace)
            // TODO: cambiar la forma en la que se obtiene el canal a req.channel (después de crear el middleware)
            const channel_found = await channelService.getById(workspace._id, channel.channel_id)
            
            res.status(200).json(
                {
                    ok: true,
                    status: 200,
                    message: 'Canal obtenido exitosamente',
                    data: {
                        channel: channel_found
                    }
                }
            )
        } catch (error) {
            //Errores esperables en el sistema
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

    async softDelete(req, res) {
        try {
            const { workspace, channel } = req
            
            const channel_found = await channelService.softDelete(workspace._id, channel.channel_id)
            
            res.status(200).json(
                {
                    ok: true,
                    status: 200,
                    message: 'Canal eliminado exitosamente',
                    data: {
                        channel: channel_found
                    }
                }
            )
        } catch (error) {
            //Errores esperables en el sistema
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

    async delete(req, res) {
        try {
            const { workspace, channel } = req
            
            const channel_found = await channelService.delete(workspace._id, channel.channel_id)
            
            res.status(200).json(
                {
                    ok: true,
                    status: 200,
                    message: 'Canal eliminado exitosamente',
                    data: {
                        channel: channel_found
                    }
                }
            )
        } catch (error) {
            //Errores esperables en el sistema
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

const channelController = new ChannelController()
export default channelController