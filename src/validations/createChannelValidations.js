const ADD_CHANNEL_CONSTANTS = {
    name_min_length: 3,
    name_max_length: 50,
    description_min_length: 3,
    description_max_length: 100
}

export const createChannelValidations = (form_data) => {
    const { name, description } = form_data
    const trimmed_name = name.trim()
    const trimmed_description = description.trim()
    let name_error = ''
    let description_error = ''

    // Validaciones para el nombre
    if (!trimmed_name) {
        name_error = 'El nombre del canal es requerido'
    }
    else if (trimmed_name.length < ADD_CHANNEL_CONSTANTS.name_min_length) {
        name_error = `El nombre del canal debe tener al menos ${ADD_CHANNEL_CONSTANTS.name_min_length} caracteres`
    }
    else if (trimmed_name.length > ADD_CHANNEL_CONSTANTS.name_max_length) {
        name_error = `El nombre del canal debe tener menos de ${ADD_CHANNEL_CONSTANTS.name_max_length} caracteres`
    }

    // Validaciones para la descripcion
    if (trimmed_description && trimmed_description.length < ADD_CHANNEL_CONSTANTS.description_min_length) {
        description_error = `La descripcion del canal debe tener al menos ${ADD_CHANNEL_CONSTANTS.description_min_length} caracteres`
    }
    else if (trimmed_description && trimmed_description.length > ADD_CHANNEL_CONSTANTS.description_max_length) {
        description_error = `La descripcion del canal debe tener menos de ${ADD_CHANNEL_CONSTANTS.description_max_length} caracteres`
    }

    return name_error || description_error || null
}