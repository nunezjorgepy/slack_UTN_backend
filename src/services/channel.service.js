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
}

const channelService = new ChannelService()

export default channelService