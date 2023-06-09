const create = (camion) => {
    let { matricula_camion, capacidad_maxima, estado } = camion;
    let values = [matricula_camion, capacidad_maxima, estado];
    return db.query('   INSERT INTO camiones (matricula_camion, capacidad_maxima,estado) \
                        VALUES \
                        (?, ?, ?)',
        values
    );
};


const getAll = () => {
    return db.query('   SELECT *\
                        FROM camiones as c'
    );
}


const getById = (camiones_id) => {
    console.log(camiones_id)
    return db.query('select * from camiones where camiones_id = ?', [camiones_id])
}


const updateById = async (camiones_id, datosQueActualizar) => {
    // Verificar operaciones inválidas
    if ('camiones_id' in datosQueActualizar) {
        throw new Error("Operación inválida. No se puede actualizar el id del camión.")
    }

    // Pedir camione
    const [[camione]] = await getById(camiones_id);

    // Actualizar camione
    Object.keys(camione).forEach((k) => {
        datosQueActualizar[k] ? camione[k] = datosQueActualizar[k] : 1;
    });

    const extractValues = (r) => ["matricula_camion", "capacidad_maxima", "estado", "camiones_id"].map(k => r[k]);
    const values = extractValues(camione);

    // Guardar en la base de datos cambiado
    return db.query(
        'UPDATE camiones \
                        SET\
                        matricula_camion=?,\
                        capacidad_maxima=?,\
                        estado= ? \
                        WHERE camiones_id = ? '
        ,
        values
    );
};


const deleteById = async (camiones_id) => {
    // Borrar un camion
    // Evitar borrar camiones predeterminados 1,2,3,4. 
    const [[camione]]=await getById(camiones_id);
    if (camione.estado != 'Inactivo') {
        throw new Error("Operación inválida. No se puede borrar un camión activo.\
                            Para borrar un camión, primero ponerlo en estado 'Inactivo'."
        );
    };

    return db.query('DELETE from camiones where camiones_id = ?', [camiones_id]);
}


module.exports = {
    create, getAll, getById, updateById, deleteById
}