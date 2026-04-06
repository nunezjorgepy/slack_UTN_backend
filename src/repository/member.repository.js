/* 
WorkspaceMemberRepository
    - create (fk_id_user, fk_id_workspace, role)
    - updateRole(id_member, role)
    - delete(id_member)
    - getMemberList(workspace_id) //Obtiene lista de miembros relacionados a ese espacio de trabajo
*/


import WorkspaceMember from "../models/workspaceMember.model.js"
class WorkspaceMemberRepository {
    async create(fk_id_user, fk_id_workspace, role) {
        return await WorkspaceMember.create({
            fk_id_user: fk_id_user,
            fk_id_workspace: fk_id_workspace,
            role: role
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

    async getWorkspaceOwnerByUserandWorkspaceId(fk_id_user, fk_id_workspace){
        return await WorkspaceMember.find({
            fk_id_user,
            fk_id_workspace,
            role: 'owner'
        })
    }

    async getActiveWorkspacesByUserId(fk_id_user) {
        /**
         * Consigue la lista de todos los espacios de trabajo activos de un usuario
         * @param {string} fk_id_user - Identificador en mongoDB del usuario
         * @returns {Array<Object>} Lista con objetos. Cada objeto representa un espacio de trabajo
         */

        // Encuentro la lista de espacios de trabajo activos
        const activeWorkspaces = await WorkspaceMember.find({fk_id_user, isActive: true })
        .populate('fk_id_user', 'name email')
        .populate('fk_id_workspace', 'title description url_image isActive')

        const activeWorkspaces_mapped = activeWorkspaces.map(
            (member) => {
                /* Normalizo */
                return {
                    member_workspace_id: member._id,
                    member_workspace_created_at: member.created_at,
                    
                    user_role: member.role,
                    user_id: member.fk_id_user._id,
                    user_name: member.fk_id_user.name,
                    user_email: member.fk_id_user.email,
                    
                    workspace_id: member.fk_id_workspace._id,
                    workspace_title: member.fk_id_workspace.title,
                    workspace_description: member.fk_id_workspace.description,
                    workspace_url_image: member.fk_id_workspace.url_image,
                    workspace_is_active: member.fk_id_workspace.isActive
                }
            }
        )

        const activeWorkspaces_filtered = activeWorkspaces_mapped.filter(
            (workspace) => workspace.workspace_is_active
        )
        
        /* TODO: verificar si esta bien después de crear el endpoint para agregar miembros */
        const activeWorkspaces_with_members = await Promise.all(
            activeWorkspaces_filtered.map(async (workspace) => {
                const members = await this.getMemberList(workspace.workspace_id);
                return {
                    ...workspace,
                    members
                };
            })
        );
        
        return activeWorkspaces_with_members;
    }

    async deleteById(workspace_member_id) {
        await WorkspaceMember.findByIdAndDelete(workspace_member_id)
    }
    async getById(workspace_member_id) {
        await WorkspaceMember.findById(workspace_member_id)
    }
    async getUserById(fk_id_user, fk_id_workspace) {
        /**
         * Consigue un usuario por id de usuario y id de espacio de trabajo
         * @param {string} fk_id_user - Identificador en mongoDB del usuario
         * @param {string} fk_id_workspace - Identificador en mongoDB del espacio de trabajo
         * @returns {Object} Objeto con los datos del usuario
         */
        return await WorkspaceMember.find(
            {
                fk_id_user,
                fk_id_workspace
            }
        )
    }
    async updateRoleById(member_id, role) {
        const new_workspace_member = await WorkspaceMember.findByIdAndUpdate(
            member_id,
            {role: role},
            { new: true }
        )
        return new_workspace_member
    }

    async getMemberList(fk_id_workspace) {

        /* 
        con el metodo populate podemos traer los datos relacionados a las referencias que tenemos en el modelo, en este caso fk_id_user y fk_id_workspace.
        Entonces si quiero traer el nombre de usuario de cada miembro podria hacer un populate de fk_id_user y seleccionar solo el campo name, quedando asi:
        */

        const members = await WorkspaceMember.find({ fk_id_workspace: fk_id_workspace })
        .populate('fk_id_user', 'name email')
        .populate('fk_id_workspace', 'title description')
        
        const members_mapped = members.map(
            (member) => {
                return {
                    member_id: member._id,
                    member_role: member.role,
                    member_created_at: member.created_at,
                    
                    user_id: member.fk_id_user._id,
                    user_name: member.fk_id_user.name,
                    user_email: member.fk_id_user.email,
                    
                    workspace_id: member.fk_id_workspace._id,
                    workspace_title: member.fk_id_workspace.title,
                    workspace_description: member.fk_id_workspace.description
                }
            }
        )
        
        return members_mapped
    }

    
}
const workspaceMemberRepository = new WorkspaceMemberRepository()
export default workspaceMemberRepository