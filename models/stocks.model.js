const create = (stock) => {
    let { unidades, materiales_id, almacenes_id, posicion } = stock;
    let values = [unidades, materiales_id, almacenes_id, posicion];
    return db.query('   INSERT INTO stocks (unidades,materiales_id,almacenes_id,posicion) \
                        VALUES \
                        (?, ?, ?,?)',
        values
    );
};


const getAll = (req) => {

    /* const query =
        'select s.*, a.almacenes_id, a.nombre_almacen,a.localidad,a.pais, a.usuarios_id_encargado, ' +
            'r.descripcion_rol, u.usuarios_id_lider,u2.email ' +
            'from stocks as s ' +
            'join almacenes as a on a.almacenes_id=s.almacenes_id ' +
            'join usuarios as u on a.usuarios_id_encargado=u.usuarios_id ' +
            'join roles as r on r.roles_id=u.roles_id ' +
            'join usuarios as u2 on u.usuarios_id_lider=u2.usuarios_id ' +
            'where ' + (req.usuario.roles_id <= 2 ? 'u.usuarios_id_lider=?' : ' a.usuarios_id_encargado = ? ');
    console.log(query)
    return db.query(query,
        req.usuario.roles_id == 1 ? [req.usuario.usuarios_id_lider] : [req.usuario.usuarios_id]
    );
*/
    const query2 =
        'select s.*, a.almacenes_id, a.nombre_almacen,a.localidad,a.pais, a.usuarios_id_encargado, ' +
        'r.descripcion_rol, u.usuarios_id_lider,u2.email ' +
        'from stocks as s ' +
        'join almacenes as a on a.almacenes_id=s.almacenes_id ' +
        'join usuarios as u on a.usuarios_id_encargado=u.usuarios_id ' +
        'join roles as r on r.roles_id=u.roles_id ' +
        'join usuarios as u2 on u.usuarios_id_lider=u2.usuarios_id ' +
        'where a.usuarios_id_encargado = ? OR u.usuarios_id_lider= ?';
    const values= [1,4].includes(req.usuarios.roles_id)?
    [req.usuario.usuarios_id_lider, req.usuario.usuarios_id_lider]:
    [req.usuario.usuarios_id, req.usuario.usuarios_id];

    return db.query(query2,
        [req.usuario.usuarios_id, req.usuario.usuarios_id]
    );
}


const getById = async (stocks_id, req) => {
    const query =
        'select s.*, a.almacenes_id, a.nombre_almacen,a.localidad,a.pais, a.usuarios_id_encargado, ' +
        'r.descripcion_rol, u.usuarios_id_lider,u2.email ' +
        'from stocks as s ' +
        'join almacenes as a on a.almacenes_id=s.almacenes_id ' +
        'join usuarios as u on a.usuarios_id_encargado=u.usuarios_id ' +
        'join roles as r on r.roles_id=u.roles_id ' +
        'join usuarios as u2 on u.usuarios_id_lider=u2.usuarios_id ' +
        'where a.usuarios_id_encargado = ? OR u.usuarios_id_lider= ? ' +
        'AND stocks_id = ?';
    const values = [1,4].includes(req.usuarios.roles_id)?
    [req.usuario.usuarios_id_lider, req.usuario.usuarios_id_lider, stocks_id]:
    [req.usuario.usuarios_id, req.usuario.usuarios_id, stocks_id];

    return db.query(query,values);
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