const { _getById: _getUsuarioById } = require('./usuarios.model');

const create = async (stock, req) => {

    let { unidades, materiales_id, almacenes_id, posicion } = stock;
    const autorizado = encargado_o_jefe(stock.almacenes_id, req);

    if (autorizado) {
        let values = [unidades, materiales_id, almacenes_id, posicion];
        return db.query('   INSERT INTO stocks (unidades,materiales_id,almacenes_id,posicion) \
                        VALUES \
                        (?, ?, ?,?)',
            values
        );
    } else {
        throw new Error("Operación inválida, sólo puede crear stocks en el almacen el que es encargado del almcen o su jefe. " +
            `Usuarios_id ${req.usuario.usuarios_id} no es el encargado del almacenes_id ${almacen.almacenes_id} con usuarios_id_encargado ${usuarios_id_encargado} ni el jefe de este último.`);

    }
};


const getAll = (req) => {
    const { query, values } = _getQueryAndValues(req);
    return db.query(query, values);
}


const getById = async (stocks_id, req) => {
    let { query, values } = _getQueryAndValues(req, stocks_id);
    return db.query(query, values);
}

const updateById = async (stocks_id, datosQueActualizar, req) => {
    // Verificar operaciones inválidas
    if ('stocks_id' in datosQueActualizar) {
        throw new Error("Operación inválida. No se puede actualizar el id del stock")
    }

    // Pedir stock
    const [[stock]] = await getById(stocks_id, req);

    const autorizado = encargado_o_jefe(stock.almacenes_id, req);

    if (autorizado) {
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
    } else {
        throw new Error("Operación inválida, sólo puede editar stocks en el almacen el que es encargado del almacen o su jefe. " +
            `Usuarios_id ${req.usuario.usuarios_id} no es el encargado del almacenes_id ${almacen.almacenes_id} con usuarios_id_encargado ${usuarios_id_encargado} ni el jefe de este último.`);

    }

};

const deleteById = async (stocks_id, req) => {
    // Borrar un stock

    // Pedir stock
    const [[stock]] = await getById(stocks_id, req);

    if (!stock) {
        throw new Error(`No stock with id ${stocks_id}`);
    }

    const autorizado = encargado_o_jefe(stock.almacenes_id, req);

    if (autorizado) {
        return db.query('DELETE from stocks where stocks_id = ?', [stocks_id]);
    } else {
        throw new Error("Operación inválida, sólo puede borrar stocks del almacen en el que es encargado o jefe de encargado del almacen o su jefe. " +
            `Usuarios_id ${req.usuario.usuarios_id} no es el encargado del almacenes_id ${almacen.almacenes_id} con usuarios_id_encargado ${usuarios_id_encargado} ni el jefe de este último.`);
    }

}


// =========== helpers =========

const _getQueryAndValues = (req, stocks_id = 0) => {
    let query =
        'select s.*, a.almacenes_id, a.nombre_almacen,a.localidad,a.pais, a.usuarios_id_encargado, ' +
        'r.descripcion_rol, u.usuarios_id_lider,u2.email, ' +
        'm.nombre as nombre_material, m.descripcion_material, cm.categorias_materiales_id,cm.descripcion as descripcion_categoria '+
        'from stocks as s ' +
        'join almacenes as a on a.almacenes_id=s.almacenes_id ' +
        'join materiales as m on s.materiales_id=m.materiales_id '+
        'join categorias_materiales as cm on cm.categorias_materiales_id=m.categorias_materiales_id '+
        'join usuarios as u on a.usuarios_id_encargado=u.usuarios_id ' +
        'join roles as r on r.roles_id=u.roles_id ' +
        'join usuarios as u2 on u.usuarios_id_lider=u2.usuarios_id ' +
        'where (a.usuarios_id_encargado = ? OR u.usuarios_id_lider= ?)' +
        (stocks_id ? ' AND s.stocks_id = ? ' : '');
    
    let values = [1, 4].includes(req.usuario.roles_id) ?
        [req.usuario.usuarios_id_lider, req.usuario.usuarios_id_lider] :
        [req.usuario.usuarios_id, req.usuario.usuarios_id];
    stocks_id ? values.push(stocks_id) : 1;
    //console.log(`query ${query}\n values ${values}`);
    return { query, values }
}

const encargado_o_jefe = async (almacenes_id, req) => {
    const [[almacen]] = await db.query('select * from almacenes where almacenes_id=?', [almacenes_id]);
    if (!almacen) { throw new Error('Operación inválida: almacen con id '+almacenes_id+' no existe.') }
    const encargadoDeAlmacen = await _getUsuarioById(almacen.usuarios_id_encargado)
    console.log(JSON.stringify(`req.usuario ${req.usuario}`))
    return (req.usuario.usuarios_id == almacen.usuarios_id_encargado || req.usuario.usuario_id == encargadoDeAlmacen.usuarios_id_lider)
}

const _getById= async (stocks_id)=>{

    const [response] = await db.query(' select * from stocks where stocks_id = ? ',[stocks_id]);
    console.log(response);
    return response;
}

const _getStockByAlmacenMaterial = async (almacenes_id,materiales_id)=>{
    const [response] = await db.query('select * from stocks where almacenes_id=? and materiales_id=?'[almacenes_id,materiales_id]);
    return response;
}

//=============EXPORTS============
module.exports = {
    create, getAll, getById,_getById, updateById,_getStockByAlmacenMaterial, deleteById, encargado_o_jefe
}