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

        // TODO: si el usuario tiene la invitación rechazada, se puede actualizar el estado a pendiente y enviar un nuevo correo. Es necesario hacer un return para no crear un nuevo registro.

        const newMember = await workspaceMemberRepository.create(
            user_found.id,
            workspace._id,
            role,
            INVITATION_CONSTANTS.PENDING
        )

        await this.sendInvitationEmail(email, newMember._id, workspace.title)

        return newMember
    }

    async sendInvitationEmail(email, newMember_id, workspace_title) {
        const accept_invitation_token = jwt.sign(
            {
                email,
                newMember_id,
                action: INVITATION_CONSTANTS.ACCEPTED
            },
            ENVIRONMENT.JWT_SECRET_KEY,
            {
                expiresIn: "1d"
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
                expiresIn: "1d"
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
                        <a href="${ENVIRONMENT.URL_FRONTEND}/response-to-invitation?token=${accept_invitation_token}" 
                           style="display: inline-block; background-color: #611f69; color: #ffffff; font-size: 16px; font-weight: 500; text-decoration: none; padding: 12px 24px; border-radius: 6px; margin: 8px 10px;">
                            Aceptar invitación
                        </a>
                        <a href="${ENVIRONMENT.URL_FRONTEND}/response-to-invitation?token=${reject_invitation_token}" 
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
}

const memberWorkspaceService = new MemberWorkspaceService()

export default memberWorkspaceService