import WorkspaceModel from "../models/workspace.model.js";
import WorkspaceMember from "../models/workspaceMember.model.js";
import workspaceMemberRepository from "./member.repository.js";
class WorkspaceRepository {
    // TODO: Documentar

    async create(title, description, url_image) {
        return await WorkspaceModel.create({
            title: title,
            description: description,
            url_image,
        })
    };

    async getById(workspace_id) {
        return await WorkspaceModel.findById(workspace_id)
    }

    async getActiveByUserID(user_id){
        const active_workspaces = await WorkspaceMember.find(
            {
                isActive: true,
                fk_id_user: user_id
            }
        ).populate('fk_id_workspace', 'title description url_image isActive')

        const active_workspaces_mapped = active_workspaces.map(
            (member) => {
                return {
                    member_id: member._id,
                    
                    workspace_id: member.fk_id_workspace._id,
                    workspace_title: member.fk_id_workspace.title,
                    workspace_url_image: member.fk_id_workspace.url_image,
                    workspace_is_active: member.fk_id_workspace.isActive
                }
            }
        )

        // Filtrar los espacios de trabajo que no estan activos
        // TODO QUESTION: Al inactivar un espacio de trabajo, es conveniente desactivar a los miembros y ahorrarse este paso?
        const active_workspaces_filtered = active_workspaces_mapped.filter(
            (member) => {
                return member.workspace_is_active
            }
        )

        // Para cada espacio de trabajo, agregar a los miembros
        const active_workspaces_with_members = await Promise.all(
            active_workspaces_filtered.map(async (workspace) => {
                const members = await workspaceMemberRepository.getMemberList(workspace.workspace_id);
                return {
                    ...workspace,
                    members
                };
            })
        );

        return active_workspaces_with_members
    }

    async edit(workspace_id, title, description, url_image) {
        return await WorkspaceModel.updateOne(
            {
                _id: workspace_id
            },
            {
                title,
                description,
                url_image
            }
        )
    }
    
    async softDelete(workspace_id) {
        return await WorkspaceModel.updateOne(
            {
                _id: workspace_id
            },
            {
                isActive: false
            }
        )
    }
}

const workspaceRepository = new WorkspaceRepository()
export default workspaceRepository;