import ChannelModel from "../models/channel.model.js"


class ChannelRepository {
    async create(workspace_id, name, description) {
        return await ChannelModel.create({
            fk_id_workspace: workspace_id,
            name,
            description
        })
    }
}

const channelRepository = new ChannelRepository()

export default channelRepository