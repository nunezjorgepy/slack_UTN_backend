import channelRepository from "../repository/channel.repository.js"
import ServerError from "../helpers/error.helper.js"
import { createChannelValidations } from "../validations/createChannelValidations.js"



class ChannelService {
    async create(workspace_id, name, description = '') {
        // Validaciones para los inputs
        const create_channel_validations_errors = createChannelValidations({ name, description })
        if (create_channel_validations_errors) {
            throw new ServerError(create_channel_validations_errors, 400)
        }

        const channel = await channelRepository.create(workspace_id, name, description)
        return channel

    }

    async getAll(workspace_id) {
        if(!workspace_id) {
            throw new ServerError("Faltan campos obligatorios", 400)
        }

        const channels = await channelRepository.getAll(workspace_id)
        return channels

    }

    async getOneChannelByWorkspaceId(workspace_id) {
        if(!workspace_id) {
            throw new ServerError("Faltan campos obligatorios", 400)
        }

        const channel = await channelRepository.getOneChannelByWorkspaceId(workspace_id)
        return channel
    }

    async getById(workspace_id, channel_id) {
        // TODO DELETE: no sé si realmente hace algo esta función. Verificar y borrar.
        if(!workspace_id || !channel_id) {
            throw new ServerError("Faltan campos obligatorios", 400)
        }

        const channel = await channelRepository.getById(channel_id)
        return channel

    }

    async softDelete(workspace_id, channel_id) {
        if(!workspace_id || !channel_id) {
            throw new ServerError("Faltan campos obligatorios", 400)
        }

        const channel = await channelRepository.softDelete(channel_id)
        return channel

    }

    async delete(workspace_id, channel_id) {
        if(!workspace_id || !channel_id) {
            throw new ServerError("Faltan campos obligatorios", 400)
        }

        const channel = await channelRepository.delete(channel_id)
        return channel

    }
}

const channelService = new ChannelService()

export default channelService