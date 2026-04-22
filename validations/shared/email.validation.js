

export const emailValidation = (email) => {
    /**
     * Descripción: Valida que el email exista y que sea un email valido
     * @param {string} email - El email a validar
     * @returns {string|null} - null si el email es valido, de lo contrario devuelve un mensaje de error
     */
    let error = '';
    const trimmed_lower_email = email.trim().toLowerCase();

    if (!trimmed_lower_email) {
        error =  'El email es requerido'
    }
    // Verificar que sea un email válido
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed_lower_email)) {
        error = 'El email no es valido'
    }

    return error || null
}