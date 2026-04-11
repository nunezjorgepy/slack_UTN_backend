import { isValidObjectId } from "mongoose"
import messageRepository from "../repository/message.repository.js"
import ServerError from "../helpers/error.helper.js"


class MessageService {
    async create(member_id, channel_id, content) {
        /**
         * Descripción: Crea un mensaje
         * @param {string} member_id - ID del miembro que crea el mensaje
         * @param {string} channel_id - ID del canal
         * @param {string} content - Contenido del mensaje
         * @returns {Object} - Mensaje creado
         */

        // Si faltan datos
        if (!member_id || !channel_id || !content.trim()) {
            throw new ServerError("Faltan datos para crear el mensaje", 400)
        }

        // Si el ID del canal es invalido
        if (!isValidObjectId(channel_id)) {
            throw new ServerError("El ID del canal es invalido", 400)
        }

        return await messageRepository.create(member_id, channel_id, content)
    }

    async getAll(channel_id) {
        /**
         * Descripción: Obtiene todos los mensajes de un canal
         * @param {string} channel_id - ID del canal
         * @returns {Array} - Lista de mensajes
         */

        // Si falta el ID
        if (!channel_id) {
            throw new ServerError("El ID del canal es requerido", 400)
        }

        // Si el ID es invalido
        if (!isValidObjectId(channel_id)) {
            throw new ServerError("El ID del canal es invalido", 400)
        }

        return await messageRepository.getAll(channel_id)
    }
}

const messageService = new MessageService()

export default messageService