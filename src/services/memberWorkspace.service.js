import mailerTransporter from "../config/mailer.config.js"
import ENVIRONMENT from "../config/environment.config.js"
import INVITATION_CONSTANTS from "../constants/invitation.constants.js"
import ROLE_CONSTANTS from "../constants/roles.constants.js"
import ServerError from "../helpers/error.helper.js"
import workspaceMemberRepository from "../repository/member.repository.js"
import userRepository from "../repository/user.repository.js"
import jwt from "jsonwebtoken"

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

    async getMemberList(workspace_id) {
        if (!workspace_id) {
            throw new ServerError("Todos los campos son obligatorios", 404)
        }

        return await workspaceMemberRepository.getMemberList(
            workspace_id
        )
    }

    async inviteMember(email, workspace, role, member_email) {
        /**
         * Descripción: Invita a un miembro al espacio de trabajo
         * @param {string} email - Email del usuario a invitar
         * @param {string} workspace - Objeto con los datos del espacio de trabajo
         * @param {string} role - Rol del usuario a invitar
         * @returns {Object} - Objeto con los datos del nuevo miembro
         */

        if (!email || !workspace || !role) {
            throw new ServerError("Todos los campos son obligatorios", 404)
        }

        // Verifico que el role otorgado sea 'user' o 'admin'
        if (role !== ROLE_CONSTANTS.USER && role !== ROLE_CONSTANTS.ADMIN) {
            throw new ServerError("El role otorgado no es valido", 400)
        }

        // Verifico que el usuario no se este auto-invitando
        if (email === member_email) {
            throw new ServerError("No puedes invitarte a ti mismo", 400)
        }

        // Verificar si el usuario existe. TODO: si no existe, se puede enviar una invitación a unirse a slack.
        const user_found = await userRepository.getByEmail(email)
        if (!user_found) {
            throw new ServerError("El usuario no existe", 404)
        }

        // Verifico que el usuario no sea miembro del espacio de trabajo
        // QUESTION: ¿Qué pasa si ya fue invitado y rechazó la invitación? ¿Se puede volver a invitar?
        const member_found = await workspaceMemberRepository.checkInvitationStatus(user_found.id, workspace._id, INVITATION_CONSTANTS.ACCEPTED)
        if (member_found) {
            throw new ServerError("El usuario ya es miembro del espacio de trabajo", 400)
        }

        // Verifico que el usuario no tenga una invitación pendiente
        const member_found_2 = await workspaceMemberRepository.checkInvitationStatus(user_found.id, workspace._id, INVITATION_CONSTANTS.PENDING)
        if (member_found_2) {
            throw new ServerError("El usuario ya tiene una invitación pendiente", 400)
        }

        const newMember = await workspaceMemberRepository.create(
            user_found.id,
            workspace._id,
            role,
            false,
            INVITATION_CONSTANTS.PENDING
        )

        await this.sendInvitationEmail(email, newMember._id, workspace.title, workspace.id)

        return newMember
    }

    async sendInvitationEmail(email, newMember_id, workspace_title, workspace_id) {
        const accept_invitation_token = jwt.sign(
            {
                email,
                newMember_id,
                action: INVITATION_CONSTANTS.ACCEPTED
            },
            ENVIRONMENT.JWT_SECRET_KEY,
            {
                expiresIn: "7d"
            }
        )

        const reject_invitation_token = jwt.sign(
            {
                email,
                newMember_id,
                action: INVITATION_CONSTANTS.REJECTED
            },
            ENVIRONMENT.JWT_SECRET_KEY,
            {
                expiresIn: "7d"
            }
        )

        /* TODO: Agregar el nombre del espacio de trabajo. Verificar si viene de req.workspace */
        /* TODO: Agregar el nombre del usuario que envia la invitación. Verificar si viene de req.user */
        /* TODO: en vez de /accept-invitation y /reject-invitation, usar /response-to-invitation */
        await mailerTransporter.sendMail({
            from: ENVIRONMENT.MAIL_USER,
            to: email,
            subject: `Invitación a ${workspace_title}`,
            text: `Hola ${email}, has sido invitado a unirte al espacio de trabajo ${workspace_title}. Haz clic en el enlace para aceptar o rechazar la invitación.`,
            html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #611f69; border-radius: 16px;">
                <div style="background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); text-align: center;">
                    <h1 style="color: #111827; font-size: 24px; font-weight: 600; margin-bottom: 16px; margin-top: 0;">Invitación a ${workspace_title}</h1>
                    <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin-bottom: 32px;">
                        Hola <strong>${email}</strong>, has sido invitado a unirte al espacio de trabajo <strong>${workspace_title}</strong>. Puedes aceptar o rechazar esta invitación utilizando los siguientes botones:
                    </p>
                    <div style="margin-bottom: 24px; text-align: center;">
                        <a href="${ENVIRONMENT.URL_FRONTEND}/${workspace_id}/response-to-invitation?token=${accept_invitation_token}" 
                           style="display: inline-block; background-color: #611f69; color: #ffffff; font-size: 16px; font-weight: 500; text-decoration: none; padding: 12px 24px; border-radius: 6px; margin: 8px 10px;">
                            Aceptar invitación
                        </a>
                        <a href="${ENVIRONMENT.URL_FRONTEND}/${workspace_id}/response-to-invitation?token=${reject_invitation_token}" 
                           style="display: inline-block; background-color: #ef4444; color: #ffffff; font-size: 16px; font-weight: 500; text-decoration: none; padding: 12px 24px; border-radius: 6px; margin: 8px 10px;">
                            Rechazar invitación
                        </a>
                    </div>
                    <p style="color: #9ca3af; font-size: 13px; line-height: 20px; margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 24px;">
                        Si los botones no funcionan, puedes usar los siguientes enlaces en tu navegador:<br><br>
                        <strong>Para aceptar:</strong><br>
                        <a href="${ENVIRONMENT.URL_FRONTEND}/response-to-invitation?token=${accept_invitation_token}" style="color: #611f69; word-break: break-all;">${ENVIRONMENT.URL_FRONTEND}/response-to-invitation?token=${accept_invitation_token}</a><br><br>
                        <strong>Para rechazar:</strong><br>
                        <a href="${ENVIRONMENT.URL_FRONTEND}/response-to-invitation?token=${reject_invitation_token}" style="color: #ef4444; word-break: break-all;">${ENVIRONMENT.URL_FRONTEND}/response-to-invitation?token=${reject_invitation_token}</a>
                    </p>
                    <p style="color: #9ca3af; font-size: 12px; margin-top: 16px;">
                        Si no esperabas esta invitación o no conoces este espacio de trabajo, puedes ignorar o rechazar este correo de forma segura.
                    </p>
                </div>
            </div>
            `
        })
    }

    async responseToInvitation(email, newMember_id, action) {
        /**
         * Descripción: Responde a una invitación al espacio de trabajo
         * @param {string} email - Email del usuario
         * @param {string} newMember_id - ID del nuevo miembro
         * @param {string} action - Acción a realizar
         * @returns {Object} - Objeto con los datos del nuevo miembro
         */
        if (!email || !newMember_id || !action) {
            throw new ServerError("Todos los campos son obligatorios", 404)
        }

        // Busco al miembro
        const member = await workspaceMemberRepository.getById(newMember_id)
        // Si acceptInvitation no es 'pending', lanzar error
        if (member.acceptInvitation !== INVITATION_CONSTANTS.PENDING) {
            throw new ServerError("Ya has respondido a esta invitación", 400)
        }

        const newMember = await workspaceMemberRepository.updateById(
            newMember_id, 
            { 
                acceptInvitation: action,
                isActive: action === INVITATION_CONSTANTS.ACCEPTED ? true : false
            }
        )
        return newMember
    }

    async deleteMember(member_id, member, workspace_id) {
        /**
         * Descripción: Elimina un miembro del espacio de trabajo (softDelete)
         * @param {string} member_id - ID del miembro a eliminar
         * @param {Object} member - Objeto con los datos del miembro
         * @param {Object} deleting_member - Objeto con los datos del miembro a eliminar
         * @returns {Object} - Objeto con los datos del miembro eliminado
         */
        if (!member_id || !member || !workspace_id) {
            throw new ServerError("Todos los campos son obligatorios.", 404)
        }

        console.log(member)

        // Busco al usuario por id y espacio de trabajo
        const deleting_member = await workspaceMemberRepository.getById(member_id)

        // Si no existe el miembro, significa que no es parte del espacio de trabajo
        if (!deleting_member) {
            throw new ServerError("No existe el miembro.", 404)
        }

        // Si el role de deleting_member es 'owner', no se puede eliminar
        if (deleting_member.role === ROLE_CONSTANTS.OWNER) {
            throw new ServerError("No puedes eliminar al dueño del espacio de trabajo.", 400)
        }

        // Si el usuario esta inactivo, ya fue eliminado
        if (!deleting_member.isActive) {
            throw new ServerError("El usuario no forma parte del espacio de trabajo.", 400)
        }

        // Siendo usuario, intenta eliminar a otro usuario
        if (member.role === ROLE_CONSTANTS.USER && member.id !== deleting_member.id) {
            throw new ServerError("No puedes eliminar a otro usuario.", 400)
        }

        // Siendo administrador, intenta eliminar a otro administrador
        if (
            member.role === ROLE_CONSTANTS.ADMIN && 
            deleting_member.role === ROLE_CONSTANTS.ADMIN && 
            member.id !== deleting_member.id
        ) {
            throw new ServerError("No puedes eliminar a otro administrador.", 400)
        }

        const deletedMember = await workspaceMemberRepository.softDeleteById(member_id)
        return deletedMember
    }

    async modifyRole(member_id, member, role) {
        /**
         * Descripción: Modifica el rol de un miembro del espacio de trabajo
         * @param {string} member_id - ID del miembro a modificar
         * @param {Object} member - Objeto con los datos del miembro
         * @param {string} role - Nuevo rol
         * @returns {Object} - Objeto con los datos del miembro modificado
         */
        if (!member_id || !member || !role) {
            throw new ServerError("Todos los campos son obligatorios.", 404)
        }        
        
        // No se puede asignar el role de owner
        if (role === ROLE_CONSTANTS.OWNER) {
            throw new ServerError("No puedes asignar el rol de owner.", 400)
        }

        // Busco al usuario por id y espacio de trabajo
        const member_to_modify = await workspaceMemberRepository.getById(member_id)

        // Si no existe el miembro, significa que no es parte del espacio de trabajo
        if (!member_to_modify) {
            throw new ServerError("No existe el miembro.", 404)
        }

        // Si el role de member_to_modify es 'owner', no se puede modificar
        if (member_to_modify.role === ROLE_CONSTANTS.OWNER) {
            throw new ServerError("No puedes modificar el rol del dueño del espacio de trabajo.", 400)
        }
        
        // Si el usuario esta inactivo, ya fue eliminado
        if (!member_to_modify.isActive) {
            throw new ServerError("El usuario no forma parte del espacio de trabajo.", 400)
        }
        
        // Si el role de member_to_modify es igual al role que se quiere modificar
        if (member_to_modify.role === role) {
            throw new ServerError("El usuario ya tiene ese rol.", 400)
        }

        // Siendo administrador, intenta modificar el rol de otro administrador
        if (
            member.role === ROLE_CONSTANTS.ADMIN && 
            member_to_modify.role === ROLE_CONSTANTS.ADMIN && 
            member.id !== member_to_modify.id
        ) {
            throw new ServerError("No puedes modificar el rol de otro administrador.", 400)
        }

        const updatedMember = await workspaceMemberRepository.updateRoleById(member_id, role)
        return updatedMember
    }
}

const memberWorkspaceService = new MemberWorkspaceService()

export default memberWorkspaceService