import ServerError from "../helpers/error.helper.js"
import workspaceMemberRepository from "../repository/member.repository.js"


class MemberWorkspaceService {
    async create(user_id, workspace_id, role) {
        if (!user_id || !workspace_id || !role) {
            throw new ServerError("Todos los campos son obligatorios", 404)
        }
        try {
            return await workspaceMemberRepository.create(
                user_id,
                workspace_id,
                role
            )
        } catch (error) {
            throw error
        }
    }

    async findOwnerByUserAndWorkspaceId(user, workspace_id){
        if(!user || !workspace_id) {
            throw new ServerError("Todos los campos son obligatorios", 404)
        }

        try {
            return await workspaceMemberRepository.getWorkspaceOwnerByUserandWorkspaceId(
                user.id,
                workspace_id
            )
        } catch (error) {
            throw error
        }
    }
}

const memberWorkspaceService = new MemberWorkspaceService()

export default memberWorkspaceService