import ChannelModel from "../models/channel.model.js"


class ChannelRepository {
    async create(workspace_id, name, description) {
        const channel = await ChannelModel.create({
            fk_id_workspace: workspace_id,
            name,
            description
        })

        // Normalizo el canal
        const normalizedChannel = {
            channel_id: channel._id,
            channel_name: channel.name,
            channel_description: channel.description,
            workspace_id: channel.fk_id_workspace,
            channel_is_active: channel.is_active
        }
        return normalizedChannel
    }

    async getAll(workspace_id) {
        const channels = await ChannelModel.find({ fk_id_workspace: workspace_id })

        // Normalizo los canales
        const normalizedChannels = channels.map(channel => {
            return {
                channel_id: channel._id,
                channel_name: channel.name,
                channel_description: channel.description,
                workspace_id: channel.fk_id_workspace,
                channel_is_active: channel.is_active
            }
        })
        return normalizedChannels
    }
}

const channelRepository = new ChannelRepository()

export default channelRepository