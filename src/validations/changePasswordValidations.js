import { passwordValidation } from "./shared/password.validation.js"


export const changePasswordValidations = (password, confirmPassword) => {
    // En este caso, también verifico que confirmPassword exista
    if (!confirmPassword) {
        return "La confirmación de la contraseña es obligatoria"
    }
    return passwordValidation(password, confirmPassword)
}