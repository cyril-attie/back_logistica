
const moment = require("moment")

const create = async (pedido) => {
    let { fecha_salida,
        fecha_llegada,
        estado_pedido,
        medida,
        fecha_creacion,
        usuarios_id_creador,
        usuarios_id_revisador,
        almacenes_id_origen,
        almacenes_id_destion,
        camiones_id,
        usuario_id_aprobador,
        stocks } = pedido;
    let values = [
        fecha_salida,
        fecha_llegada,
        estado_pedido,
        medida,
        fecha_creacion,
        usuarios_id_creador,
        usuarios_id_revisador,
        almacenes_id_origen,
        almacenes_id_destion,
        camiones_id,
        usuario_id_aprobador];
    let response = await db.query('   INSERT INTO pedidos (fecha_salida,fecha_llegada,\
estado_pedido,medida,fecha_creacion,usuarios_id_creador,usuarios_id_revisador,\
almacenes_id_origen,almacenes_id_destion,camiones_id,usuario_id_aprobador) \
                        VALUES \
                        (?,?,?,?,?,?,?,?,?,?,?)',
        values
    );

    if ("insertId" in response[0]) {
        _setStocks( response[0].insertId, stocks)
    }
    return response
};


const getAll = async () => {
    let response = await db.query('SELECT * FROM pedidos as p');
    let [pedidos] = response;
    pedidos = await Promise.all(
        pedidos.map(async (pedido) => {
            pedido.stocks = await _readStocks(pedido.pedidos_id);
            return pedido;
        })
      )
    return response;
}


const _setStocks= (pedidos_id,stocks) =>{
    console.log(`_setStocks ${JSON.stringify(stocks)}`)

    Object.keys(stocks).forEach(async (stocks_id) => {
        await db.query('   INSERT INTO pedidos_have_stocks \
        (pedidos_id,stocks_id,unidades_utilizadas,posicion) VALUES (?,?,?,?)',
            [pedidos_id, stocks_id, stocks[stocks_id]["unidades"], stocks[stocks_id]["posicion"] ])
    });
}


const _readStocks = async (pedidos_id) => {
    let [stocks] = await db.query('select * from pedidos_have_stocks where pedidos_id = ?', [pedidos_id]);
    let result = {} 
    if (stocks) {
        stocks.forEach((stock) => {
            result[stock.stocks_id]={};
            result[stock.stocks_id]["unidades"] = stock.unidades_utilizadas;
            result[stock.stocks_id]["posicion"] = stock.posicion;
        });
    }
    return result
}

const getById = async (pedidos_id) => {
    let response = await db.query('select * from pedidos where pedidos_id = ?', [pedidos_id]);
    let [[pedido]] = response;
    if (pedido) {
        pedido.stocks = await _readStocks(pedidos_id);
    }
    return response;
}


const _getById = async (pedidos_id) => {
    return await db.query('select * from pedidos where pedidos_id = ?', [pedidos_id]);

}


const updateById = async (pedidos_id, datosQueActualizar) => {
    // Verificar operaciones inválidas
    if ('pedidos_id' in datosQueActualizar) {
        throw new Error("Operación inválida. No se puede actualizar el id del pedido.")
    }

    // Pedir pedido
    const [[pedido]] = await getById(pedidos_id);


    Object.keys(pedido).forEach((k, i, arr) => {
        if (typeof pedido[k] == "object") {
            console.log(moment(pedido[k]).format('YYYY-MM-DD HH:mm:ss'));
        }

    });

    // Actualizar pedido
    Object.keys(pedido).forEach((k) => {
        datosQueActualizar[k] ? pedido[k] = datosQueActualizar[k] : 1;
        // dar formato de MySQL a las fechas
        if (["fecha_salida", "fecha_llegada", "fecha_creacion"].includes(k)) {
            pedido[k] = moment(pedido[k]).format('YYYY-MM-DD HH:mm:ss');
        }
    });

    const extractValues = (r) => [
        "fecha_salida", "fecha_llegada",
        "estado_pedido", "medida", "fecha_creacion", "usuarios_id_creador", "usuarios_id_revisador",
        "almacenes_id_origen", "almacenes_id_destion", "camiones_id", "usuario_id_aprobador", "pedidos_id"
    ].map(k => r[k]);

    const values = extractValues(pedido);

    //actualizar los stocks
    db.query('DELETE FROM pedidos_have_stocks WHERE pedidos_id=?',[pedido.pedidos_id]);
    _setStocks(pedido.pedidos_id, pedido.stocks);


    // Guardar en la base de datos cambiado
    return db.query(
        'UPDATE pedidos \
SET \
fecha_salida=?,\
fecha_llegada=?,\
estado_pedido=?,\
medida=?,\
fecha_creacion=?,\
usuarios_id_creador=?,\
usuarios_id_revisador=?,\
almacenes_id_origen=?,\
almacenes_id_destion=?,\
camiones_id=?,\
usuario_id_aprobador=? \
WHERE pedidos_id = ? '
        ,
        values
    );


};


const deleteById = async (pedidos_id) => {
    // Borrar un pedido
    // Evitar borrar pedidos predeterminados 1,2,3,4. 
    db.query('DELETE FROM pedidos_have_stocks WHERE pedidos_id=?',[pedidos_id]);
    return db.query('DELETE from pedidos where pedidos_id = ?', [pedidos_id]);
}


module.exports = {
    create, getAll, getById, updateById, deleteById, _getById
}