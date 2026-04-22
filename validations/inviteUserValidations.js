import ROLE_CONSTANTS from "../src/constants/roles.constants.js";
import { emailValidation } from "./shared/email.validation.js";


export const inviteUserValidations = (values, members) => {
    const { email, role } = values;
    let email_error = emailValidation(email);
    let role_error = '';

    // Validación extra para el mail: que el usuario no forme parte del espacio.
    if (members.find(member => member.user_email === email)) email_error = 'El usuario ya es miembro del espacio de trabajo';

    if (!role) role_error = 'El rol es requerido';
    // Si ROLE_CONSTANTS no contiene el rol, mostrar error
    else if (!Object.values(ROLE_CONSTANTS).includes(role)) role_error = 'El rol no es valido';

    return email_error || role_error || null
}