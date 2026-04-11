import ChannelMessages from "../models/channelMessages.model.js";

class MessageRepository {
    async create(member_id, channel_id, content) {
        return await ChannelMessages.create(
            {
                fk_id_member: member_id,
                fk_id_channel: channel_id,
                content
            }
        )
    }

    async getAll(channel_id) {
        return await ChannelMessages.find({ fk_id_channel: channel_id })
    }
}

const messageRepository = new MessageRepository()

export default messageRepository