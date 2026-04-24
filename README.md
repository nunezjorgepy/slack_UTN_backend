# Slack Clone - Backend

Este proyecto es el Backend para una aplicación clon de Slack, un servicio de mensajería. La API permite la gestión de espacios de trabajo, canales de comunicación, membresías con diferentes roles y el intercambio de mensajes entre usuarios.

## ¿Qué hace?
La aplicación permite a los usuarios:
- **Crear Espacios de Trabajo (Workspaces):** Entornos colaborativos independientes.
- **Gestionar Canales:** Dentro de cada espacio, se pueden crear múltiples canales para organizar las conversaciones.
- **Enviar Mensajes:** Comunicación dentro de los canales.
- **Gestión de Membresías:** Cada espacio cuenta con miembros que pueden tener los siguientes roles:
    - **Owner (Dueño):** Solo puede haber uno por espacio. Tiene control total, incluyendo la eliminación del espacio de trabajo.
    - **Administrador:** Puede gestionar canales e invitar a nuevos usuarios.
    - **Usuario:** Puede participar en los canales y enviar mensajes.
- **Control de Acceso:** Solo el Owner o el Administrador pueden invitar a nuevos usuarios. Solo el Owner tiene el permiso exclusivo para borrar un espacio de trabajo.

La persistencia de datos se realiza utilizando **MongoDB** como base de datos.

---

## Middlewares

En esta sección se detallan los middlewares encargados de la lógica de autenticación, autorización y validación de datos.

### 1. `authMiddleware`
- **¿Qué hace?**: Se encarga de verificar si el usuario está autenticado y autorizado validando el token JWT.
- **¿Qué recibe?**: El token JWT enviado en el header `Authorization` (ej: `Bearer <token>`).
- **¿Qué agrega en el request?**: `req.user` (el payload del usuario contenido en el token).

### 2. `verifyWorkspaceMiddleware`
- **¿Qué hace?**: Verifica si el espacio de trabajo solicitado existe en la base de datos.
- **¿Qué recibe?**: `workspace_id` a través de `req.params`.
- **¿Qué agrega en el request?**: `req.workspace` (el objeto completo del espacio de trabajo).

### 3. `verifyMemberWorkspaceMiddleware`
- **¿Qué hace?**: Verifica si el usuario autenticado es un miembro activo del espacio de trabajo y si posee los roles necesarios para realizar la acción solicitada.
- **¿Qué recibe?**: `req.user`, `req.workspace` y opcionalmente una lista de roles permitidos (`valid_roles`).
- **¿Qué agrega en el request?**: `req.member` (el objeto de la membresía del usuario).

### 4. `verifyChannelMiddleware`
- **¿Qué hace?**: Se encarga de verificar si el canal existe y si pertenece efectivamente al espacio de trabajo proporcionado.
- **¿Qué recibe?**: `channel_id` en `req.params` y `req.workspace`.
- **¿Qué agrega en el request?**: `req.channel` (el objeto del canal).

### 5. `errorHandlerMiddleware`
- **¿Qué hace?**: Captura y gestiona todos los errores lanzados en la aplicación, devolviendo una respuesta estandarizada al cliente.
- **¿Qué recibe?**: El objeto `error` capturado por Express.
- **¿Qué agrega en el request?**: Nada (finaliza el ciclo de solicitud-respuesta).

---

## Endpoints

### Autenticación (`/api/auth`)

#### `POST /register`
- **Descripción**: Registra un nuevo usuario en la plataforma.
- **Recibe**:
    - **Body**: `{ email, name, password, confirmPassword }`
- **Respuesta**:
    ```json
    {
      "ok": true,
      "status": 201,
      "message": "El usuario se ha creado exitosamente"
    }
    ```

#### `POST /login`
- **Descripción**: Autentica a un usuario y devuelve un token de sesión.
- **Recibe**:
    - **Body**: `{ email, password }`
- **Respuesta**:
    ```json
    {
      "ok": true,
      "status": 200,
      "message": "Login successful",
      "data": { "auth_token": "JWT_TOKEN" }
    }
    ```

#### `GET /verify-email`
- **Descripción**: Verifica la dirección de correo electrónico del usuario.
- **Recibe**:
    - **Query**: `verify_email_token`
- **Respuesta**:
    ```json
    {
      "ok": true,
      "status": 200,
      "message": "El correo electronico ha sido verificado exitosamente"
    }
    ```

#### `POST /reset-password-request`
- **Descripción**: Solicita un restablecimiento de contraseña mediante el envío de un correo electrónico.
- **Recibe**:
    - **Body**: `{ email }`
- **Respuesta**:
    ```json
    {
      "ok": true,
      "status": 200,
      "message": "Se ha enviado un correo electrónico para restablecer la contraseña"
    }
    ```

#### `POST /reset-password/:reset_password_token`
- **Descripción**: Establece una nueva contraseña utilizando un token válido.
- **Recibe**:
    - **Params**: `reset_password_token`
    - **Body**: `{ password, confirmPassword }`
- **Respuesta**:
    ```json
    {
      "ok": true,
      "status": 200,
      "message": "La contraseña se ha restablecido exitosamente"
    }
    ```

---

### Espacios de Trabajo (`/api/workspace`)

#### `GET /`
- **Descripción**: Obtiene todos los espacios de trabajo asociados al usuario autenticado.
- **Respuesta**:
    ```json
    {
      "ok": true,
      "status": 200,
      "message": "Espacios de trabajo obtenidos",
      "data": { "workspaces": [...] }
    }
    ```

#### `GET /active`
- **Descripción**: Obtiene los espacios de trabajo activos del usuario, incluyendo el primer canal disponible de cada uno.
- **Respuesta**:
    ```json
    {
      "ok": true,
      "status": 200,
      "message": "Espacios de trabajo obtenidos",
      "data": { "workspaces": [...] }
    }
    ```

#### `GET /:workspace_id`
- **Descripción**: Obtiene la información detallada de un espacio de trabajo específico, incluyendo sus miembros y canales.
- **Recibe**:
    - **Params**: `workspace_id`
- **Respuesta**:
    ```json
    {
      "ok": true,
      "status": 200,
      "message": "Espacio de trabajo obtenido",
      "data": { "workspace": {}, "members": [], "channels": [], "member_logged": {} }
    }
    ```

#### `POST /create`
- **Descripción**: Crea un nuevo espacio de trabajo y un canal general inicial.
- **Recibe**:
    - **Body**: `{ title, description, url_image }`
- **Respuesta**:
    ```json
    {
      "ok": true,
      "status": 201,
      "message": "Espacio de trabajo creado",
      "data": { "workspace": {}, "channel_id": "ID" }
    }
    ```

#### `PATCH /:workspace_id`
- **Descripción**: Edita la información de un espacio de trabajo (Solo Owner).
- **Recibe**:
    - **Params**: `workspace_id`
    - **Body**: `{ title, description, url_image }`
- **Respuesta**:
    ```json
    {
      "ok": true,
      "status": 200,
      "message": "Espacio editado exitósamente."
    }
    ```

#### `DELETE /:workspace_id`
- **Descripción**: Realiza un borrado lógico del espacio de trabajo (Solo Owner).
- **Recibe**:
    - **Params**: `workspace_id`
- **Respuesta**:
    ```json
    {
      "ok": true,
      "status": 200,
      "message": "Espacio eliminado exitosamente."
    }
    ```

---

### Canales (`/api/workspace/:workspace_id/channel`)

#### `POST /`
- **Descripción**: Crea un nuevo canal dentro del espacio de trabajo.
- **Recibe**:
    - **Body**: `{ name, description }`
- **Respuesta**:
    ```json
    {
      "ok": true,
      "status": 201,
      "message": "Canal creado exitosamente",
      "data": { "channel": {} }
    }
    ```

#### `GET /`
- **Descripción**: Obtiene todos los canales de un espacio de trabajo.
- **Respuesta**:
    ```json
    {
      "ok": true,
      "status": 200,
      "message": "Canales obtenidos exitosamente",
      "data": { "channels": [] }
    }
    ```

#### `GET /:channel_id`
- **Descripción**: Obtiene un canal por su ID, incluyendo sus mensajes.
- **Recibe**:
    - **Params**: `channel_id`
- **Respuesta**:
    ```json
    {
      "ok": true,
      "status": 200,
      "message": "Canal obtenido exitosamente",
      "data": { "channel": {}, "messages": [] }
    }
    ```

---

### Mensajes (`/api/workspace/:workspace_id/channel/:channel_id/message`)

#### `POST /`
- **Descripción**: Envía un nuevo mensaje a un canal.
- **Recibe**:
    - **Body**: `{ content }`
- **Respuesta**:
    ```json
    {
      "ok": true,
      "status": 201,
      "message": "Mensaje creado exitosamente",
      "data": { "message": {} }
    }
    ```

#### `GET /`
- **Descripción**: Obtiene todos los mensajes de un canal específico.
- **Respuesta**:
    ```json
    {
      "ok": true,
      "status": 200,
      "message": "Mensajes obtenidos exitosamente",
      "data": { "messages": [] }
    }
    ```

---

### Miembros (`/api/workspace/:workspace_id/member`)

#### `POST /invite`
- **Descripción**: Invita a un nuevo usuario al espacio de trabajo (Solo Owner/Admin).
- **Recibe**:
    - **Body**: `{ email, role }`
- **Respuesta**:
    ```json
    {
      "ok": true,
      "status": 200,
      "message": "Miembro invitado.",
      "data": { "newMember": {} }
    }
    ```

#### `PATCH /response-to-invitation`
- **Descripción**: Responde a una invitación (aceptar o rechazar).
- **Recibe**:
    - **Query**: `response_token` (Token enviado por email)
- **Respuesta**:
    ```json
    {
      "ok": true,
      "status": 200,
      "message": "Has aceptado la invitación...",
      "data": { "newMember": {} }
    }
    ```

#### `DELETE /:member_id`
- **Descripción**: Elimina a un miembro del espacio de trabajo.
- **Recibe**:
    - **Params**: `member_id`
- **Respuesta**:
    ```json
    {
      "ok": true,
      "status": 200,
      "message": "Miembro eliminado.",
      "data": { "deletedMember": {} }
    }
    ```

#### `PUT /:member_id`
- **Descripción**: Modifica el rol de un miembro (Solo Owner/Admin).
- **Recibe**:
    - **Params**: `member_id`
    - **Body**: `{ role }`
- **Respuesta**:
    ```json
    {
      "ok": true,
      "status": 200,
      "message": "Miembro actualizado.",
      "data": { "updatedMember": {} }
    }
    ```

---

### Salud del Sistema (`/api/health`)

#### `GET /`
- **Descripción**: Verifica que la API esté funcionando.
- **Respuesta**:
    ```json
    { "message": "La API funciona correctamente", "status": 200, "ok": true }
    ```

#### `GET /database`
- **Descripción**: Verifica la conexión con la base de datos.
- **Respuesta**:
    ```json
    { "message": "La DB funciona correctamente", "status": 200, "ok": true }
    ```
