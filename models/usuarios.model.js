

const create = (usuario, req) => {
    if (usuario.usuarios_id_lider != req.usuario.usuarios_id) {
        throw new Error("ERROR: no puedes crear un usuario en otro equipo. El campo 'usuarios_id_lider' debe ser el 'usuarios_id' del creador de nuevos usuarios.");
    }

    let { nombre, apellido, email, contrasena, activo, edad, ciudad, codigo_postal, pais, roles_id, usuarios_id_lider, estado, imagen } = usuario;
    let values = [nombre, apellido, email, contrasena, activo ? activo : 1, edad, ciudad, codigo_postal, pais, roles_id, usuarios_id_lider, estado, imagen];

    return db.query('   INSERT INTO usuarios (nombre, apellido, email, contrasena, activo, edad, ciudad, codigo_postal, pais, roles_id,usuarios_id_lider, estado, imagen) \
                        VALUES \
                        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?,?)',
        values
    );
};


const getAll = (req) => {
    return db.query('select u.usuarios_id,u.nombre,u.email,u.apellido,u.activo,u.edad, u.ciudad, u.codigo_postal, u.pais, u.imagen, u.estado, u.roles_id, u.usuarios_id_lider,' +
        'r.descripcion_rol as rol_de_usuario, ' +
        'u2.nombre as nombre_de_jefe, u2.roles_id as rol_de_jefe ' +
        'from usuarios as u ' +
        'join roles as r on r.roles_id=u.roles_id ' +
        'join usuarios as u2 on u.usuarios_id_lider=u2.usuarios_id ' +
        'where u.usuarios_id_lider=?', [req.usuario.usuarios_id]
    );
}


const getById = async (usuarios_id,req) => {
    console.log(req.usuario)
    const [[response]] = await db.query('select u.usuarios_id,u.nombre,u.email,u.apellido,u.activo,u.edad, u.ciudad, u.codigo_postal, u.pais, u.imagen, u.estado, u.roles_id, u.usuarios_id_lider,' +
        'r.descripcion_rol as rol_de_usuario, ' +
        'u2.nombre as nombre_jefe,u2.email as email_jefe, u2.roles_id as rol_jefe ' +
        'from usuarios as u ' +
        'join roles as r on r.roles_id=u.roles_id ' +
        'join usuarios as u2 on u.usuarios_id_lider=u2.usuarios_id ' +
        'where (u.usuarios_id_lider=? or u.usuarios_id=?) and u.usuarios_id=?',
        [req.usuario.usuarios_id, req.usuario.usuarios_id, usuarios_id]
    );
    if (!response) {
        throw new Error(`No hay ningún usuario con id ${req.params.usuarios_id} en su equipo.`)
    } else {
        console.log(response)
        return response;
    }

}


const updateById = async (usuarios_id, datosQueActualizar, req) => {

    // Pedir usuario
    const usuario = await getById(usuarios_id,req);

    // Verificar operaciones inválidas
    if ('usuarios_id' in datosQueActualizar) {
        throw new Error("Operación inválida. No se puede actualizar el id del usuario")
    } else if (req.usuario.usuarios_id != usuario.usuarios_id_lider) {
        throw new Error(`Operación inválida. No puede editar un usuario del cual no es el jefe de equipo. Para editar el usuario ${usuario.email} contacte con el jefe de su equipo ${usuario.email_jefe}.`)
    } else if ('roles_id' in datosQueActualizar && datosQueActualizar.roles_id <= 2) {
        throw new Error("Operación inválida. No se puede asignar el rol de jefe de equipo. Para ser jefe de equipo, crear un nuevo jefe de equipo usando la ruta /api/register.")
    }

    // Actualizar usuario
    Object.keys(usuario).forEach((k) => {
        datosQueActualizar[k] ? usuario[k] = datosQueActualizar[k] : 1;
    });

    const extractValues = (u) => ["nombre", "apellido", "email", "contrasena",
        "activo", "edad", "ciudad", "codigo_postal",
        "pais", "roles_id", "usuarios_id_lider", "estado", "imagen", "usuarios_id"].map(k => u[k]);

    const values = extractValues(usuario);

    // Guardar en la base de datos cambiado
    return db.query(
        'UPDATE usuarios \
                        SET \
                        nombre = ?, apellido = ?, email = ?, contrasena = ?, \
                        activo = ?, edad = ?, ciudad = ?, codigo_postal = ?, \
                        pais = ?, roles_id = ?,usuarios_id_lider=?, estado=?, imagen=?\
                        WHERE usuarios_id = ?'
        ,
        values
    );
};


const deleteById = async (usuarios_id, req) => {
    // Pedir usuario
    const [[usuario]] = await getById(usuarios_id);
    if (usuario.usuarios_id === usuario.usuarios_id_lider) {
        throw new Error("Operación inválida. No se puede borrar un jefe de equipo.")
    } else if (req.usuario.usuarios_id != usuario.usuarios_id_lider) {
        throw new Error(`Operación inválida: borrar un usuario que no está en su equipo. No puede editar un usuario del cual no es el jefe de equipo. Para editar el usuario ${usuario.email} contacte con el jefe de su equipo ${usuario.email_jefe}.`)
    }

    return db.query('DELETE from usuarios where usuarios_id = ?', [usuarios_id]);
}



const _getById = (usuarios_id) => {
    return db.query('select * from usuarios where usuarios_id=?', [usuarios_id]);
}


const _getByEmail = (email) => {
    return db.query('SELECT * FROM usuarios WHERE email = ?', [email]);
}



module.exports = {
    create, getAll, getById, _getByEmail, updateById, deleteById, _getById
}