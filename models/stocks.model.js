const create = (stock) => {
    let {  unidades,materiales_id,almacenes_id,posicion} = stock;
    let values = [unidades,materiales_id,almacenes_id,posicion];
    return db.query('   INSERT INTO stocks (unidades,materiales_id,almacenes_id,posicion) \
                        VALUES \
                        (?, ?, ?,?)',
        values
    );
};


const getAll = () => {
    return db.query('   SELECT *\
                        FROM stocks as s'
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

    const extractValues = (r) => ["unidades","materiales_id","almacenes_id","posicion","stocks_id"].map(k => r[k]);
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