const create = (role) => {
    let { descripcion_rol, responsabilidad, comentario } = role;
    let values = [descripcion_rol, responsabilidad, comentario];
    return db.query('   INSERT INTO roles (descripcion_rol, responsabilidad, comentario) \
                        VALUES \
                        (?, ?, ?)',
        values
    );
};


const getAll = () => {
    return db.query('   SELECT *\
                        FROM roles as r'
    );
}


const getRolePermissionsOf = (roles_id)=>{
    return db.query('select permisos_id from roles_have_permisos where roles_id = ?', [roles_id]);
}

const getById = (roles_id) => {
    console.log(roles_id)
    return db.query('select * from roles where roles_id = ?', [roles_id])
}


const updateById = async (roles_id, datosQueActualizar) => {
    // Verificar operaciones inválidas
    if ('roles_id' in datosQueActualizar) {
        throw new Error("Operación inválida. No se puede actualizar el id del role")
    }

    // Pedir role
    const [[role]] = await getById(roles_id);

    // Actualizar role
    Object.keys(role).forEach((k) => {
        datosQueActualizar[k] ? role[k] = datosQueActualizar[k] : 1;
    });

    const extractValues = (r) => ["descripcion_rol", "responsabilidad", "comentario","roles_id"].map(k => r[k]);
    const values = extractValues(role);

    // Guardar en la base de datos cambiado
    return db.query(
        'UPDATE roles \
                        SET\
                        descripcion_rol = ?, \
                        responsabilidad = ?, \
                        comentario = ? \
                        WHERE roles_id = ? '
        ,
        values
    );
};


const deleteById = async (roles_id) => {
    // Borrar un rol
    // Evitar borrar roles predeterminados 1,2,3,4. 
    if (roles_id < 5) {
        throw new Error(    "Operación inválida. No se puede borrar un rol predefinido.\
                            Para borrar un rol, primero debe ser creado."
                            );
    };

    return db.query('DELETE from roles where roles_id = ?', [roles_id]);
}


module.exports = {
    create, getAll, getById, updateById, deleteById, getRolePermissionsOf
}