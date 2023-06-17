const create = (stock) => {
    let { unidades, materiales_id, almacenes_id, posicion } = stock;
    let values = [unidades, materiales_id, almacenes_id, posicion];
    return db.query('   INSERT INTO stocks (unidades,materiales_id,almacenes_id,posicion) \
                        VALUES \
                        (?, ?, ?,?)',
        values
    );
};


const getAll = (almacenes_id) => {
    return db.query('select s.stocks_id, s.unidades, s.posicion, ' +
        's.materiales_id,m.nombre as nombre_material, m.descripcion_material,m.categorias_materiales_id as categorias_materiales_id, ' +
        'cm.descripcion as descripcion_categoria, cm.comentario as comentario_categoria ' +
        'from stocks as s ' +
        'join materiales as m on s.materiales_id=m.materiales_id ' +
        'join categorias_materiales as cm on cm.categorias_materiales_id=m.categorias_materiales_id ' +
        'where s.almacenes_id = ?',[almacenes_id]
    );
}


const getById = (stocks_id) => {
    console.log(stocks_id)
    return db.query('select * from stocks where stocks_id = ?', [stocks_id])
}


const updateById = async (stocks_id, datosQueActualizar) => {
    // Verificar operaciones inválidas
    if ('stocks_id' in datosQueActualizar) {
        throw new Error("Operación inválida. No se puede actualizar el id del stock")
    }

    // Pedir stock
    const [[stock]] = await getById(stocks_id);

    // Actualizar stock
    Object.keys(stock).forEach((k) => {
        datosQueActualizar[k] ? stock[k] = datosQueActualizar[k] : 1;
    });

    const extractValues = (r) => ["unidades", "materiales_id", "almacenes_id", "posicion", "stocks_id"].map(k => r[k]);
    const values = extractValues(stock);

    // Guardar en la base de datos cambiado
    return db.query(
        'UPDATE stocks \
                        SET\
                        unidades = ?, \
                        materiales_id = ?, \
                        almacenes_id = ?, \
                        posicion=?\
                        WHERE stocks_id = ? '
        ,
        values
    );
};


const deleteById = async (stocks_id) => {
    // Borrar un stock
    // Evitar borrar stocks predeterminados 1,2,3,4. 

    return db.query('DELETE from stocks where stocks_id = ?', [stocks_id]);
}


module.exports = {
    create, getAll, getById, updateById, deleteById
}