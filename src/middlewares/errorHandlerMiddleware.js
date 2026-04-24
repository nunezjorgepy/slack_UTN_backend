

function errorHandlerMiddleware(error, req, res, next) {
    /**
     * Descripción:
     * - Se encarga de manejar los errores
     * - Se encarga de enviar la respuesta al cliente
     * 
     * Recibe:
     * - error: El error
     * - req: El objeto de solicitud
     * - res: El objeto de respuesta
     * - next: La funcion next
     * 
     * Devuelve:
     * - Una respuesta al cliente con el error, en caso de existir.
     */
    
    // Si el error tiene un status, es un error controlado (ServerError)
    if (error.status) {
        return res.status(error.status).json({
            ok: false,
            status: error.status,
            message: error.message
        })
    }

    // Errores de JWT
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
        return res.status(401).json({
            ok: false,
            status: 401,
            message: "Token inválido o expirado"
        })
    }

    // Errores de sintaxis (ej: JSON malformado en el body)
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
        return res.status(400).json({
            ok: false,
            status: 400,
            message: "Error de sintaxis en el cuerpo de la petición"
        })
    }

    // Error interno genérico
    return res.status(500).json({
        ok: false,
        status: 500,
        message: "Error interno del servidor"
    })
}

export default errorHandlerMiddleware