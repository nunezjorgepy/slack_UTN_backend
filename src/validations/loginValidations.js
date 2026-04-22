import { emailValidation } from "./shared/email.validation.js"
import { passwordValidation } from "./shared/password.validation.js"


export const loginValidation = (email, password) => {
    /**
     * Descripción: Valida que el email y la contraseña sean validos
     * @param {string} email - El email a validar
     * @param {string} password - La contraseña a validar
     * @returns {string|null} - null si el email y la contraseña son validos, de lo contrario devuelve un mensaje de error
     * El error devuelto es genérico para no dar información sobe los usuarios o contraseñas a posibles atacantes.
     */
    let error = emailValidation(email) || passwordValidation(password)

    return error ? 'Email o contraseña incorrectos' : null
}