import INVITATION_CONSTANTS from "../constants/invitation.constants.js"
import ServerError from "../helpers/error.helper.js"
import workspaceMemberRepository from "../repository/member.repository.js"
import userRepository from "../repository/user.repository.js"

// TODO: hay algunas funciones que creo que ya no se utiliazn más. Verificar y eliminar.

class MemberWorkspaceService {
    async create(user_id, workspace_id, role, isActive = false) {
        if (!user_id || !workspace_id || !role) {
            throw new ServerError("Todos los campos son obligatorios", 404)
        }
        return await workspaceMemberRepository.create(
            user_id,
            workspace_id,
            role,
            isActive
        )
    }

    // TODO: verificar si se usa en algún otro lado. Caso contrario, eliminar.
    /* async findOwnerByUserAndWorkspaceId(user, workspace_id){
        if(!user || !workspace_id) {
            throw new ServerError("Todos los campos son obligatorios", 404)
        }

        return await workspaceMemberRepository.getWorkspaceOwnerByUserandWorkspaceId(
            user.id,
            workspace_id
        )
    } */

    async getActiveWorkspacesByUserId(user_id) {
        if (!user_id) {
            throw new ServerError("Todos los campos son obligatorios", 404)
        }

        return await workspaceMemberRepository.getActiveWorkspacesByUserId(
            user_id
        )
    }

    async getMemberList(workspace_id) {
        if (!workspace_id) {
            throw new ServerError("Todos los campos son obligatorios", 404)
        }

        return await workspaceMemberRepository.getMemberList(
            workspace_id
        )
    }

    async addMember(fk_id_user, fk_id_workspace, role) {
        if (!fk_id_user || !fk_id_workspace || !role) {
            throw new ServerError("Todos los campos son obligatorios", 404)
        }

        const member_found = await workspaceMemberRepository.getUserById(fk_id_user, fk_id_workspace)
        if (member_found) {
            throw new ServerError("El usuario ya es miembro del espacio de trabajo", 400)
        }

        return await workspaceMemberRepository.create(
            fk_id_user,
            fk_id_workspace,
            role
        )
    }

    async inviteMember(email, fk_id_workspace, role) {
        /**
         * Descripción: Invita a un miembro al espacio de trabajo
         * @param {string} email - Email del usuario a invitar
         * @param {string} fk_id_workspace - ID del espacio de trabajo
         * @param {string} role - Rol del usuario a invitar
         * @returns {Object} - Objeto con los datos del nuevo miembro
         */
        if (!email || !fk_id_workspace || !role) {
            throw new ServerError("Todos los campos son obligatorios", 404)
        }

        // Verificar si el usuario existe. TODO: si no existe, se puede enviar una invitación a unirse a slack.
        const user_found = await userRepository.getByEmail(email)
        if (!user_found) {
            throw new ServerError("El usuario no existe", 404)
        }

        const member_found = await workspaceMemberRepository.checkInvitationStatus(user_found.id, fk_id_workspace, INVITATION_CONSTANTS.ACCEPTED)
        if (member_found) {
            throw new ServerError("El usuario ya es miembro del espacio de trabajo", 400)
        }

        const newMember = await workspaceMemberRepository.create(
            user_found.id,
            fk_id_workspace,
            role,
            INVITATION_CONSTANTS.PENDING
        )

        // TODO: enviar mail de invitación

        return newMember
    }
}

const memberWorkspaceService = new MemberWorkspaceService()

export default memberWorkspaceService