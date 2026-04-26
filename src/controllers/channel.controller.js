import channelService from "../services/channel.service.js"
import messageService from "../services/message.service.js"
import workspaceMemberRepository from "../repository/member.repository.js"


class ChannelController {
    async create(req, res, next) {
        try {
            const workspace = req.workspace
            const { name, description } = req.body

            const channel = await channelService.create(
                workspace._id, 
                name.trim(), 
                description.trim()
            )
            
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
            next(error)
        }
    }   

    async getAll(req, res, next) {
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
            next(error)
        }
    }

    async getById(req, res, next) {
        try {
            const { workspace, channel } = req
            const workspace_id = workspace._id
            const channel_id = channel.channel_id

            // Obtener todos los mensajes del canal
            const messages = await messageService.getAll(channel_id)
            
            // Obtener información adicional del workspace
            const members = await workspaceMemberRepository.getActiveMemberList(workspace_id)
            const channels = await channelService.getActiveByWorkspaceId(workspace_id)
            
            res.status(200).json(
                {
                    ok: true,
                    status: 200,
                    message: 'Canal obtenido exitosamente',
                    data: {
                        workspace,
                        members,
                        channels,
                        member_logged: req.member,
                        messages
                    }
                }
            )
        } catch (error) {
            next(error)
        }
    }

    async softDelete(req, res, next) {
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
            next(error)
        }
    }

    async update(req, res, next) {
        try {
            const { workspace_id, channel_id } = req.params
            const { name, description } = req.body

            const update_data = {}
            if (name !== undefined) update_data.name = name.trim()
            if (description !== undefined) update_data.description = description.trim()

            const channel = await channelService.update(workspace_id, channel_id, update_data)

            res.status(200).json(
                {
                    ok: true,
                    status: 200,
                    message: 'Canal actualizado exitosamente',
                    data: {
                        channel
                    }
                }
            )
        } catch (error) {
            next(error)
        }
    }

    async delete(req, res, next) {
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
            next(error)
        }
    }
}

const channelController = new ChannelController()
export default channelController