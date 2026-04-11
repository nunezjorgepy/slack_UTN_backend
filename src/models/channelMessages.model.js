/* 
ChannelMessages
-fk_id_channel
-content
-fk_id_member
-created_at

*/

import mongoose from "mongoose";

const channelMessagesSchema = new mongoose.Schema({
    fk_id_channel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channel",
        required: true
    },
    fk_id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const ChannelMessages = mongoose.model("ChannelMessage", channelMessagesSchema)

export default ChannelMessages