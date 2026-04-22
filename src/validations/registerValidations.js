// El nombre tendrá como mínimo 3 y máximo 50 caracteres, y no puede estar vacio. Tampoco pueden contener espacios. Hacer trim y pasarlo a minúscula para evitar que Jorge y jorge estén permitidos.

import { emailValidation } from "./shared/email.validation.js"
import { passwordValidation } from "./shared/password.validation.js"

export const registerValidation = (name, email, password, confirmPassword) => {
    /**
     * Descripción: Valida que el email y la contraseña sean validos
     * @param {string} name - El email a validar
     * @param {string} email - La contraseña a validar
     * @param {string} password - La contraseña a validar
     * @param {string} confirmPassword - La contraseña a validar
     * @returns {string|null} - null si el email y la contraseña son validos, de lo contrario devuelve un mensaje de error
     */
    let name_error = ''
    let trimmed_lower_name = name.trim().toLowerCase()

    /* 
    Posibles errores para el nombre
    */
    // Si el nombre no existe, mostrar error
    if (!trimmed_lower_name) name_error = 'El nombre es requerido'
    // Si tiene más o menos de los caracteres permitidos, mostrar error
    else if (trimmed_lower_name.length < 3) name_error = 'El nombre debe tener al menos 3 caracteres.'
    else if (trimmed_lower_name.length > 50) name_error = 'El nombre debe tener menos de 50 caracteres.'

    // Validar que exista confirmPassword
    if (!confirmPassword) {
        return 'La confirmación de contraseña es requerida'
    }

    let error = name_error || emailValidation(email) || passwordValidation(password, confirmPassword)

    return error || null
}
