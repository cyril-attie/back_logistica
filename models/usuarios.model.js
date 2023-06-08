

const create = (usuario) => {
    let { nombre, apellido, email, contrasena, activo, edad, ciudad, codigo_postal, pais, roles_id, usuarios_id_lider } = usuario;
    let values = [nombre, apellido, email, contrasena, activo ? activo : 1, edad, ciudad, codigo_postal, pais, roles_id, usuarios_id_lider];
    return db.query('   INSERT INTO usuarios (nombre, apellido, email, contrasena, activo, edad, ciudad, codigo_postal, pais, roles_id,usuarios_id_lider) \
                        VALUES \
                        (?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)',
        values
    );
};


const getAll = () => {
    return db.query('   SELECT *\
                        FROM usuarios as u'
    );
}


const getById = (usuarios_id) => {
    console.log(usuarios_id)
    return db.query('select * from usuarios where usuarios_id = ?', [usuarios_id])
}


const getByEmail = (email) => {
    console.log(email)
    return db.query('select * from usuarios where email = ?', [email])
}


const updateById = async (usuarios_id, datosQueActualizar) => {

    // Verificar operaciones inválidas
    if ('usuarios_id' in datosQueActualizar) {
        throw new Error("Operación inválida. No se puede actualizar el id del usuario")
    } else if ( 'usuarios_id_lider' in datosQueActualizar) {
        throw new Error("Operación inválida. No se puede actualizar el jefe del usuario.")
    } else if ('roles_id' in datosQueActualizar && datosQueActualizar.roles_id<=2) {
        throw new Error("Operación inválida. No se puede asignar el rol de jefe de equipo.")
    } 
    
    // Pedir usuario
    const [[usuario]] = await getById(usuarios_id);

    // Actualizar usuario
    Object.keys(usuario).forEach((k)=>{
        datosQueActualizar[k]?usuario[k]=datosQueActualizar[k]:1;
    });
    
    const extractValues = (u) => ["nombre", "apellido", "email", "contrasena",
    "activo", "edad", "ciudad", "codigo_postal",
    "pais", "roles_id", "usuarios_id_lider","usuarios_id"].map(k => u[k]);

    const values = extractValues(usuario);

    // Guardar en la base de datos cambiado
    return db.query(
                        'UPDATE usuarios \
                        SET \
                        nombre = ?, apellido = ?, email = ?, contrasena = ?, \
                        activo = ?, edad = ?, ciudad = ?, codigo_postal = ?, \
                        pais = ?, roles_id = ?, usuarios_id_lider = ? \
                        WHERE usuarios_id = ?'
        ,
        values
    );
};


const deleteById = async (usuarios_id) => {
    // Pedir usuario
    const [[usuario]] = await getById(usuarios_id);
    if (usuario.usuarios_id===usuario.usuarios_id_lider) {
        throw new Error("Operación inválida. No se puede borrar un jefe de equipo.")
    };

    return db.query('DELETE from usuarios where usuarios_id = ?', [usuarios_id]);
}

module.exports = {
    create, getAll, getById, getByEmail, updateById, deleteById
}