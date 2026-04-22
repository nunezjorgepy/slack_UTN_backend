import { emailValidation } from "./shared/email.validation.js";


export const changePasswordRequestValidations = (email) => {
    let email_error = emailValidation(email);

    return email_error || null
}