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
        const messages = await ChannelMessages.find({ fk_id_channel: channel_id })
            .populate('fk_id_member', 'name')

        const messages_mapped = messages.map(
            (message) => {
                return {
                    message_id: message._id,
                    content: message.content,
                    created_at: message.created_at,
                    fk_id_member: message.fk_id_member,
                    fk_id_channel: message.fk_id_channel
                }
            }
        )

        return messages_mapped
    }
}

const messageRepository = new MessageRepository()

export default messageRepository