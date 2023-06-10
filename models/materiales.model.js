const create = (material) => {
    let { estado,
        peso,
        descripcion_material,
        categorias_materiales_id } = material;
    let values = [estado, peso, descripcion_material, categorias_materiales_id];
    return db.query('   INSERT INTO materiales (estado,peso,descripcion_material,categorias_materiales_id  ) \
                        VALUES \
                        (?, ?, ?,?)',
        values
    );
};


const getAll = () => {
    return db.query('   SELECT *\
                        FROM materiales as m'
    );
}


const getById = (materiales_id) => {
    console.log(materiales_id)
    return db.query('select * from materiales where materiales_id = ?', [materiales_id])
}


const updateById = async (materiales_id, datosQueActualizar) => {
    // Verificar operaciones inválidas
    if ('materiales_id' in datosQueActualizar) {
        throw new Error("Operación inválida. No se puede actualizar el id del material.")
    }

    // Pedir materiale
    const [[materiale]] = await getById(materiales_id);

    // Actualizar materiale
    Object.keys(materiale).forEach((k) => {
        datosQueActualizar[k] ? materiale[k] = datosQueActualizar[k] : 1;
    });

    const extractValues = (r) => ["estado", "peso", "descripcion_material", "categorias_materiales_id","materiales_id"].map(k => r[k]);
    const values = extractValues(materiale);

    // Guardar en la base de datos cambiado
    return db.query(
        'UPDATE materiales \
                        SET\
                        estado=?,\
                        peso=?,\
                        descripcion_material=?,\
                        categorias_materiales_id =?\
                        WHERE materiales_id = ? '
        ,
        values
    );
};


const deleteById = async (materiales_id) => {
    // Borrar un material
    // Evitar borrar materiales predeterminados 1,2,3,4. 
    const [[materiale]] = await getById(materiales_id);


    return db.query('DELETE from materiales where materiales_id = ?', [materiales_id]);
}


module.exports = {
    create, getAll, getById, updateById, deleteById
}