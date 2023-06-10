
const moment = require("moment")

const create = (pedido) => {
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
        usuario_id_aprobador } = pedido;
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
    return db.query('   INSERT INTO pedidos (fecha_salida,fecha_llegada,\
estado_pedido,medida,fecha_creacion,usuarios_id_creador,usuarios_id_revisador,\
almacenes_id_origen,almacenes_id_destion,camiones_id,usuario_id_aprobador) \
                        VALUES \
                        (?,?,?,?,?,?,?,?,?,?,?)',
        values
    );
};


const getAll = () => {
    return db.query('   SELECT *\
                        FROM pedidos as p'
    );
}


const getById = (pedidos_id) => {
    console.log(pedidos_id)
    return db.query('select * from pedidos where pedidos_id = ?', [pedidos_id])
}


const updateById = async (pedidos_id, datosQueActualizar) => {
    // Verificar operaciones inválidas
    if ('pedidos_id' in datosQueActualizar) {
        throw new Error("Operación inválida. No se puede actualizar el id del pedido.")
    }

    // Pedir pedido
    const [[pedido]] = await getById(pedidos_id);


   Object.keys(pedido).forEach((k,i,arr)=>{
    if (typeof pedido[k]=="object"){
    console.log(moment(pedido[k]).format('YYYY-MM-DD HH:mm:ss'));
    }
     
});

    // Actualizar pedido
    Object.keys(pedido).forEach((k) => {
        datosQueActualizar[k] ? pedido[k] = datosQueActualizar[k] : 1;
        // dar formato de MySQL a las fechas
        if (["fecha_salida","fecha_llegada","fecha_creacion"].includes(k)) {
            pedido[k] = moment(pedido[k]).format('YYYY-MM-DD HH:mm:ss');
        }
    });

    const extractValues = (r) => [
        "fecha_salida","fecha_llegada",
"estado_pedido","medida","fecha_creacion","usuarios_id_creador","usuarios_id_revisador",
"almacenes_id_origen","almacenes_id_destion","camiones_id","usuario_id_aprobador","pedidos_id"
    ].map(k => r[k]);

    const values = extractValues(pedido);

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
    const [[pedido]] = await getById(pedidos_id);
    return db.query('DELETE from pedidos where pedidos_id = ?', [pedidos_id]);
}


module.exports = {
    create, getAll, getById, updateById, deleteById
}