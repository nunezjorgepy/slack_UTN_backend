

export const createWorkspaceValidations = (values) => {
    /**
     * Descripción: Valida que los inputs del formulario para el espacio de trabajo sean validos. Sirve tanto para crear como para editar.
     * @param {string} title - El título a validar
     * @param {string} description - La descripción a validar
     * @param {string} url_image - La url de la imagen a validar
     * @returns {string|null} - null si los inputs son validos, de lo contrario devuelve un mensaje de error
     */
    let name_error = ''
    let description_error = ''
    let url_image_error = ''
    const { title, description, url_image } = values
    let trimmed_title = title.trim()
    let trimmed_description = description.trim()
    let trimmed_url_image = url_image.trim()

    /* 
    =======================
    Errores para el título
    =======================
    */
    if (!trimmed_title) {
        name_error = 'El nombre del espacio de trabajo es requerido';
    }
    // Si tiene menos de 5 caracteres, mostrar error
    else if (trimmed_title.length < 5) {
        name_error = 'El título del espacio de trabajo debe tener al menos 5 caracteres';
    }
    // Si tiene mas de 50 caracteres, mostrar error
    else if (trimmed_title.length > 50) {
        name_error = 'El título del espacio de trabajo debe tener menos de 50 caracteres';
    }

    /* 
    ===========================
    Errores para la descripción
    ===========================
    */
    if (trimmed_description && trimmed_description.length < 10) {
        description_error = 'La descripción debe tener al menos 10 caracteres';
    }
    else if (trimmed_description && trimmed_description.length > 100) {
        description_error = 'La descripción debe tener menos de 100 caracteres';
    }

    /* 
    ===========================
    Errores para la url_image
    ===========================
    */
    // Debe tener los formatos jpg, jpeg o png
    if (trimmed_url_image && !/\.(jpg|jpeg|png)$/i.test(trimmed_url_image)) {
        url_image_error = 'La url de la imagen debe tener los formatos jpg, jpeg o png';
    }

    return name_error || description_error || url_image_error || null
}