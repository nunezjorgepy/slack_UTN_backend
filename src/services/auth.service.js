//Responsabilidad de manejar la logica de negocio
/* 
Registro:
    - Validar que no exista previamente el usuario
    - Enviar un mail de verificacion de correo electronico
*/
import jwt from 'jsonwebtoken'
import ENVIRONMENT from "../config/environment.config.js";
import mailerTransporter from "../config/mailer.config.js";
import ServerError from "../helpers/error.helper.js";
import userRepository from "../repository/user.repository.js";
import bcrypt from 'bcrypt'

class AuthService {
    async register({ name, email, password, confirmPassword }) {
        if (!name || !email || !password || !confirmPassword) {
            throw new ServerError("Todos los campos son obligatorios", 400);
        }

        if (password !== confirmPassword) {
            throw new ServerError("Las contraseñas no coinciden", 400);
        }

        const userByEmail = await userRepository.getByEmail(email);
        if (userByEmail) {
            throw new ServerError('Email ya registrado!', 400)
        }
        const userByUsername = await userRepository.getByUsername(name);
        if (userByUsername) {
            throw new ServerError('Nombre de usuario ya registrado!', 400)
        }
        const passwordHashed = await bcrypt.hash(password, 12)
        const userCreated = await userRepository.create(name, email, passwordHashed);
        await this.sendVerifyEmail({email, name})
        
    }

    async verifyEmail({ verify_email_token }) {
        if (!verify_email_token) {
            throw new ServerError('No se encuentra el token', 400)
        }

        //ESTO ES CLAVE
        //Gracias a esto sabremos si el token fue creado por nosotros
        const {email, name} = jwt.verify(verify_email_token, ENVIRONMENT.JWT_SECRET_KEY)
        const user = await userRepository.getByEmail(email)
        if(!user){
            throw new ServerError('El usuario no existe', 404)
        }
        else if(user.email_verified){
            throw new ServerError('Usuario con email ya validado', 400)
        }
        else{
            const user_updated = await userRepository.updateById(
                user._id,
                {email_verified: true}
            )
            if(!user_updated.email_verified){
                throw new ServerError('Usuario no se pudo actualizar', 400)
            }
            else{
                return user_updated
            }
        }
    }

    async login({email, password}){
        const user = await userRepository.getByEmail(email);
        if (!user) {
            throw new ServerError('Usuario o contraseña incorrectos', 404);
        }
        if (!user.email_verified) {
            throw new ServerError('El usuario no ha verificado su correo', 401);
        }
        const is_same_password = await bcrypt.compare(password, user.password)
        if (!is_same_password) {
            throw new ServerError('Usuario o contraseña incorrectos', 401);
        }
        
        const auth_token = jwt.sign(
            {
                email: user.email,
                name: user.name,
                id: user._id,
                created_at: user.created_at
            },
            ENVIRONMENT.JWT_SECRET_KEY,
            {
                expiresIn: '7d'
            }
        )
        return auth_token
    }


    async sendVerifyEmail({email, name}) {
        //Se crea un token firmado por el backend con el email del usuario a registrar
        const verify_email_token = jwt.sign(
            {
                email: email,
                name: name
            },
            ENVIRONMENT.JWT_SECRET_KEY,
            {
                expiresIn: '7d'
            }
        )
        await mailerTransporter.sendMail(
            {
                from: ENVIRONMENT.MAIL_USER,
                to: email,
                subject: `Bienvenido ${name} verifica tu correo electronico`,
                html: `
                <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #611f69; border-radius: 16px;">
                    <div style="background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); text-align: center;">
                        <h1 style="color: #111827; font-size: 24px; font-weight: 600; margin-bottom: 16px; margin-top: 0;">¡Bienvenido, ${name}!</h1>
                        <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin-bottom: 32px;">
                            Te has registrado correctamente. Para poder comenzar, necesitamos verificar tu dirección de correo electrónico haciendo clic en el siguiente botón:
                        </p>
                        <a href="${ENVIRONMENT.URL_FRONTEND + `/verify-email?verify_email_token=${verify_email_token}`}" 
                           style="display: inline-block; background-color: #611f69; color: #ffffff; font-size: 16px; font-weight: 500; text-decoration: none; padding: 12px 24px; border-radius: 6px; margin-bottom: 24px;">
                            Verificar mi correo
                        </a>
                        <p style="color: #9ca3af; font-size: 13px; line-height: 20px; margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 24px;">
                            Si el botón superior no funciona, copia y pega este enlace en tu navegador:<br>
                            <a href="${ENVIRONMENT.URL_FRONTEND + `/verify-email?verify_email_token=${verify_email_token}`}" style="color: #611f69; word-break: break-all;">${ENVIRONMENT.URL_FRONTEND + `/verify-email?verify_email_token=${verify_email_token}`}</a>
                        </p>
                        <p style="color: #9ca3af; font-size: 12px; margin-top: 16px;">
                            Si no reconoces este registro, puedes desestimar de forma segura este correo.
                        </p>
                    </div>
                </div>
                `
            }
        )

    }

     async resetPasswordRequest({email}) {
        if (!email) {
            throw new ServerError("El email es obligatorio", 400)
        }
        const user = await userRepository.getByEmail(email);
        if (!user) {
            throw new ServerError("El usuario no existe", 404)
        }

        const reset_password_token = jwt.sign(
            {
                email
            },
            ENVIRONMENT.JWT_SECRET_KEY,
            {
                expiresIn: "1d"
            }
        )

        await mailerTransporter.sendMail({
            from: ENVIRONMENT.MAIL_USER,
            to: email,
            subject: "Restablecimiento de contraseña",
            html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #611f69; border-radius: 16px;">
                <div style="background-color: #ffffff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05); text-align: center;">
                    <h1 style="color: #111827; font-size: 24px; font-weight: 600; margin-bottom: 16px; margin-top: 0;">Restablecimiento de contraseña</h1>
                    <p style="color: #4b5563; font-size: 16px; line-height: 24px; margin-bottom: 32px;">
                        Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Haz clic en el botón de abajo para elegir una nueva contraseña:
                    </p>
                    <a href="${ENVIRONMENT.URL_FRONTEND + `/reset-password/${reset_password_token}`}" 
                        style="display: inline-block; background-color: #611f69; color: #ffffff; font-size: 16px; font-weight: 500; text-decoration: none; padding: 12px 24px; border-radius: 6px; margin-bottom: 24px;">
                        Restablecer contraseña
                    </a>
                    <p style="color: #9ca3af; font-size: 13px; line-height: 20px; margin-top: 32px; border-top: 1px solid #e5e7eb; padding-top: 24px;">
                        Si el botón superior no funciona, copia y pega este enlace en tu navegador:<br>
                        <a href="${ENVIRONMENT.URL_FRONTEND + `/reset-password/${reset_password_token}`}" style="color: #611f69; word-break: break-all;">${ENVIRONMENT.URL_FRONTEND + `/reset-password/${reset_password_token}`}</a>
                    </p>
                    <p style="color: #9ca3af; font-size: 12px; margin-top: 16px;">
                        Si no has solicitado este cambio, por favor ignora este correo. Tu contraseña seguirá siendo la misma.
                    </p>
                </div>
            </div>
            `
        })
    }

      async resetPassword({reset_password_token, password}) {
        if (!reset_password_token || !password) {
            throw new ServerError("Todos los campos son obligatorios", 400)
        }
        // Verificamos que el token sea valido
        const { email } = jwt.verify(reset_password_token, ENVIRONMENT.JWT_SECRET_KEY);
        const user = await userRepository.getByEmail(email);
        if (!user) {
            throw new ServerError("El usuario no existe", 404)
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        await userRepository.updateById(user._id, { password: hashedPassword });
    }
}

const authService = new AuthService()

export default authService