import ServerError from "../helpers/error.helper.js"
import workspaceMemberRepository from "../repository/member.repository.js"


class MemberWorkspaceService {
    async create(user_id, workspace_id, role) {
        if (!user_id || !workspace_id || !role) {
            throw new ServerError("Todos los campos son obligatorios", 404)
        }
        return await workspaceMemberRepository.create(
            user_id,
            workspace_id,
            role
        )
    }

    async findOwnerByUserAndWorkspaceId(user, workspace_id){
        if(!user || !workspace_id) {
            throw new ServerError("Todos los campos son obligatorios", 404)
        }

        return await workspaceMemberRepository.getWorkspaceOwnerByUserandWorkspaceId(
            user.id,
            workspace_id
        )
    }

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

        const existingMember = await workspaceMemberRepository.getUserById(fk_id_user, fk_id_workspace)
        if (existingMember) {
            throw new ServerError("El usuario ya es miembro del espacio de trabajo", 400)
        }

        return await workspaceMemberRepository.create(
            fk_id_user,
            fk_id_workspace,
            role
        )
    }
}

const memberWorkspaceService = new MemberWorkspaceService()

export default memberWorkspaceService