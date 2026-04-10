import ROLE_CONSTANTS from "../constants/roles.constants.js"
import WorkspaceMember from "../models/workspaceMember.model.js"
class WorkspaceMemberRepository {
    async create(fk_id_user, fk_id_workspace, role, isActive, acceptInvitation) {
        /**
         * Descripción: Crea un nuevo miembro del espacio de trabajo
         * @param {string} fk_id_user - ID del usuario
         * @param {string} fk_id_workspace - ID del espacio de trabajo
         * @param {string} role - Rol del usuario
         * @param {boolean} isActive - Estado de actividad del usuario
         * @param {string} acceptInvitation - Estado de la invitación
         * @returns {Object} - Objeto con los datos del nuevo miembro
         */
        return await WorkspaceMember.create({
            fk_id_user: fk_id_user,
            fk_id_workspace: fk_id_workspace,
            role: role,
            isActive: isActive,
            acceptInvitation: role === 'owner' ? null : acceptInvitation
        })
    }

    async getWorkspaceListByUserId(user_id){
        /**
         *  Consigue la lista de todos los espacios de trabajo de un usuario
         * @param {string} user_id - Identificador en mongoDB del usuario
         * @returns {Array<Object>} Lista con objetos. Cada objeto representa un espacio de trabajo
         */

        //Toda la lista de miembros donde el usuario sea miembro
        const member = await WorkspaceMember.find({fk_id_user: user_id})
        .populate('fk_id_workspace')

        const members_mapped = member.map(
            (member) => {
                return {
                    member_id: member._id,
                    member_role: member.role,
                    member_created_at: member.created_at,
                    
                    workspace_id: member.fk_id_workspace._id,
                    workspace_title: member.fk_id_workspace.title,
                    workspace_description: member.fk_id_workspace.description
                }
            }
        )

        return members_mapped
    }

    async deleteById(workspace_member_id) {
        return await WorkspaceMember.findByIdAndDelete(workspace_member_id)
    }

    async getById(workspace_member_id) {
        return await WorkspaceMember.findById(workspace_member_id)
    }

    async checkInvitationStatus(fk_id_user, fk_id_workspace, acceptInvitation) {
        /**
         * Consigue un usuario por id de usuario y id de espacio de trabajo
         * @param {string} fk_id_user - Identificador en mongoDB del usuario
         * @param {string} fk_id_workspace - Identificador en mongoDB del espacio de trabajo
         * @param {string} acceptInvitation - Estado de la invitación
         * @returns {Object} Objeto con los datos del usuario
         */
        return await WorkspaceMember.findOne(
            {
                fk_id_user,
                fk_id_workspace,
                acceptInvitation
            }
        )
    }

    async getUserById(fk_id_user, fk_id_workspace) {
        /**
         * Consigue un usuario por id de usuario y id de espacio de trabajo
         * @param {string} fk_id_user - Identificador en mongoDB del usuario
         * @param {string} fk_id_workspace - Identificador en mongoDB del espacio de trabajo
         * @returns {Object} Objeto con los datos del usuario
         */
        return await WorkspaceMember.findOne(
            {
                fk_id_user,
                fk_id_workspace
            }
        )
    }

    async updateRoleById(member_id, role) {
        /**
         * Descripción: Actualiza el rol de un miembro del espacio de trabajo
         * @param {string} member_id - ID del miembro
         * @param {string} role - Rol del miembro
         * @returns {Object} - Objeto con los datos del nuevo miembro
         */
        const new_workspace_member = await WorkspaceMember.findByIdAndUpdate(
            member_id,
            {role: role},
            { new: true }
        )
        return new_workspace_member
    }

    async updateById(member_id, data) {
        /**
         * Descripción: Actualiza el estado de la invitación de un miembro del espacio de trabajo
         * @param {string} member_id - ID del miembro
         * @param {Object} data - Datos a actualizar
         * @returns {Object} - Objeto con los datos del nuevo miembro
         */
        const new_workspace_member = await WorkspaceMember.findByIdAndUpdate(
            member_id,
            data,
            { returnDocument: 'after' }
        )
        return new_workspace_member
    }

    // Se usa en el servicio de workspace
    async getMemberList(fk_id_workspace) {
        /**
         * Descripción: Obtiene la lista de miembros de un espacio de trabajo
         * @param {string} fk_id_workspace - ID del espacio de trabajo
         * @returns {JSON} - Lista de miembros
         */

        const members = await WorkspaceMember.find({ fk_id_workspace: fk_id_workspace })
        .populate('fk_id_user', 'name email')
        
        const members_mapped = members.map(
            (member) => {
                return {
                    member_id: member._id,
                    member_role: member.role,
                    member_created_at: member.created_at,
                    
                    user_id: member.fk_id_user._id,
                    user_name: member.fk_id_user.name,
                    user_email: member.fk_id_user.email,
                }
            }
        )
        
        return members_mapped
    }
    async getActiveMemberList(fk_id_workspace) {
        /**
         * Descripción: Obtiene la lista de miembros activos de un espacio de trabajo
         * @param {string} fk_id_workspace - ID del espacio de trabajo
         * @returns {JSON} - Lista de miembros activos
         */

        const members = await WorkspaceMember.find({ fk_id_workspace: fk_id_workspace, isActive: true })
        .populate('fk_id_user', 'name email')
        
        const members_mapped = members.map(
            (member) => {
                return {
                    member_id: member._id,
                    member_role: member.role,
                    member_created_at: member.created_at,
                    
                    user_id: member.fk_id_user._id,
                    user_name: member.fk_id_user.name,
                    user_email: member.fk_id_user.email,
                }
            }
        )
        
        return members_mapped
    }

    
}
const workspaceMemberRepository = new WorkspaceMemberRepository()
export default workspaceMemberRepository