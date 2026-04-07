import channelRepository from "../repository/channel.repository.js"
import ServerError from "../helpers/error.helper.js"


class ChannelService {
    async create(workspace_id, name, description) {
        if(!workspace_id || !name) {
            throw new ServerError("Faltan campos obligatorios", 400)
        }

        try {
            const channel = await channelRepository.create(workspace_id, name, description)
            return channel
        } catch (error) {
            throw error
        }
    }

    async getAll(workspace_id) {
        if(!workspace_id) {
            throw new ServerError("Faltan campos obligatorios", 400)
        }

        try {
            const channels = await channelRepository.getAll(workspace_id)
            return channels
        } catch (error) {
            throw error
        }
    }

    async getById(workspace_id, channel_id) {
        if(!workspace_id || !channel_id) {
            throw new ServerError("Faltan campos obligatorios", 400)
        }

        try {
            const channel = await channelRepository.getById(workspace_id, channel_id)
            return channel
        } catch (error) {
            throw error
        }
    }

    async softDelete(workspace_id, channel_id) {
        if(!workspace_id || !channel_id) {
            throw new ServerError("Faltan campos obligatorios", 400)
        }

        try {
            const channel = await channelRepository.softDelete(workspace_id, channel_id)
            return channel
        } catch (error) {
            throw error
        }
    }

    async delete(workspace_id, channel_id) {
        if(!workspace_id || !channel_id) {
            throw new ServerError("Faltan campos obligatorios", 400)
        }

        try {
            const channel = await channelRepository.delete(workspace_id, channel_id)
            return channel
        } catch (error) {
            throw error
        }
    }
}

const channelService = new ChannelService()

export default channelService