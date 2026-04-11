import ChannelMessages from "../models/channelMessages.model.js";

class MessageRepository {
    async create(user_id, channel_id, content) {
        const message = await ChannelMessages.create(
            {
                fk_id_user: user_id,
                fk_id_channel: channel_id,
                content
            }
        )

        const normalized_message = {
            message_id: message._id,
            message_content: message.content,
            message_created_at: message.created_at,
            message_id_channel: message.fk_id_channel,
            message_id_user: message.fk_id_user._id,
            message_user_name: message.fk_id_user.name,
        }

        return normalized_message
    }

    async getAll(channel_id) {
        const messages = await ChannelMessages.find({ fk_id_channel: channel_id })
            .populate('fk_id_user', 'name')

        const messages_mapped = messages.map(
            (message) => {
                return {
                    message_id: message._id,
                    message_content: message.content,
                    message_created_at: message.created_at,
                    message_id_channel: message.fk_id_channel,
                    message_id_user: message.fk_id_user._id,
                    message_user_name: message.fk_id_user.name,
                }
            }
        )

        return messages_mapped
    }
}

const messageRepository = new MessageRepository()

export default messageRepository