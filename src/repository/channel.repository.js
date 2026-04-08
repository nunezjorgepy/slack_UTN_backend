import ChannelDTO from "../dto/channel.dto.js"
import ChannelModel from "../models/channel.model.js"


class ChannelRepository {
    async create(workspace_id, name, description) {
        const channel = await ChannelModel.create({
            fk_id_workspace: workspace_id,
            name,
            description
        })

        // Normalizo el canal
        // TODO: sacar las normalizaciones
        const normalized_channel = new ChannelDTO(channel)
        return normalized_channel
    }

    async getAll(workspace_id) {
        const channels = await ChannelModel.find({ fk_id_workspace: workspace_id })

        // Normalizo los canales
        const normalizedChannels = channels.map(channel => {
            return new ChannelDTO(channel)
        })
        return normalizedChannels
    }

    async getById(channel_id) {
        const channel = await ChannelModel.findById(channel_id)

        // Normalizo el canal, solamente si existe
        const normalized_channel = channel && new ChannelDTO(channel)
        return normalized_channel
    }

    async softDelete(channel_id) {
        const channel = await ChannelModel.findByIdAndUpdate(
            channel_id,
            { is_active: false },
            { returnDocument: 'after' }
        )

        // Normalizo el canal
        const normalized_channel = channel && new ChannelDTO(channel)
        return normalized_channel
    }

    async delete(channel_id) {
        const channel = await ChannelModel.findByIdAndDelete(
            channel_id
        )

        // Normalizo el canal
        const normalized_channel = channel && new ChannelDTO(channel)
        return normalized_channel
    }
}

const channelRepository = new ChannelRepository()

export default channelRepository