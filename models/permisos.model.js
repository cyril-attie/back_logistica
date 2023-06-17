


const create = (permiso) => {
    let {metodo,ruta } = permiso;
    let values = [metodo,ruta];
    return db.query('   INSERT INTO permisos (metodo,ruta) \
                        VALUES \
                        (?, ?)',
        values
    );
};


const getAll = () => {
    return db.query('   SELECT *\
                        FROM permisos as p'
    );
}


const getById = (permisos_id) => {
    return db.query('select * from permisos where permisos_id = ?', [permisos_id])
}

const getIdByMetodoRuta = (metodo, ruta) => {
    return db.query('select * from permisos where metodo = ? and ? LIKE ruta', [metodo, ruta])
}

const updateById = async (permisos_id, datosQueActualizar) => {
    // Verificar operaciones inválidas
    if ('permisos_id' in datosQueActualizar) {
        throw new Error("Operación inválida. No se puede actualizar el id del permiso")
    }

    // Pedir permiso
    const [[permiso]] = await getById(permisos_id);

    // Actualizar permiso
    Object.keys(permiso).forEach((k) => {
        datosQueActualizar[k] ? permiso[k] = datosQueActualizar[k] : 1;
    });

    const extractValues = (r) => ["metodo", "ruta", "permisos_id"].map(k => r[k]);
    const values = extractValues(permiso);

    // Guardar en la base de datos cambiado
    return db.query(
        'UPDATE permisos \
                        SET\
                        metodo = ?, \
                        ruta = ? \
                        WHERE permisos_id = ? '
        ,
        values
    );
};


const deleteById = async (permisos_id) => {
    // Borrar un permiso 
    return db.query('DELETE from permisos where permisos_id = ?', [permisos_id]);
}


module.exports = {
    create, getAll, getById, updateById, deleteById,getIdByMetodoRuta
}