import mongoose from "mongoose";
import ROLE_CONSTANTS from "../constants/roles.constants.js";
import INVITATION_CONSTANTS from "../constants/invitation.constants.js";

const workspaceMemberSchema = new mongoose.Schema({
    fk_id_user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    fk_id_workspace: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Workspace',
        required: true
    },
    role: {
        type: String,
        enum: ROLE_CONSTANTS,
        default: ROLE_CONSTANTS.USER
    },
    acceptInvitation: {
        type: String,
        enum: INVITATION_CONSTANTS
    },
    isActive: {
        type: Boolean,
        default: true
    },
    created_at: {
        type: Date,
        default: Date.now,
        required: true
    },
    updated_at: {
        type: Date,
        default: Date.now,
        required: true
    }
})

const WorkspaceMember = mongoose.model('WorkspaceMember', workspaceMemberSchema)

export default WorkspaceMember