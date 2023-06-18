
const moment = require("moment")
const { _getById: _getUsuarioById } = require('./usuarios.model')
const { _getById: _getAlmacenById } = require('./almacenes.model')


const create = async (pedido, req) => {
    console.log(`pedido ${JSON.stringify(pedido)}`);
    if ((await _verificarNormasDeNegocio(pedido)) && (await _verificarUsuarioRelacionadoCon(pedido, req))) {

        let { fecha_salida,
            fecha_llegada,
            estado_pedido,
            medida,
            fecha_creacion,
            usuarios_id_creador,
            usuarios_id_revisador,
            almacenes_id_origen,
            almacenes_id_destino,
            camiones_id,
            usuarios_id_aprobador,
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
            almacenes_id_destino,
            camiones_id,
            usuarios_id_aprobador];
        let response = await db.query('   INSERT INTO pedidos (fecha_salida,fecha_llegada,\
estado_pedido,medida,fecha_creacion,usuarios_id_creador,usuarios_id_revisador,\
almacenes_id_origen,almacenes_id_destino,camiones_id,usuarios_id_aprobador) \
                        VALUES \
                        (?,?,?,?,?,?,?,?,?,?,?)',
            values
        );

        if ("insertId" in response[0]) {
            _setStocks(response[0].insertId, stocks)
        }
        return response
    } else {
        throw new Error('Operación inválida: verifica que pedido ' + JSON.stringify(pedido) + ' cumple con las siguientes condiciones.'
            + 'La fecha de creación debe ser anterior a la de salida y esta anterior a la de llegada. ' +
            'El revisador y aprobador deben pertencer al mismo equipo que el creador. ' +
            'El revisador debe ser encargado del almacen de origen y el aprobador ser encargado del almacen de destino.')
    }
};



const getAll = async (req) => {
    let response = await db.query(' select p.*, u.usuarios_id_lider as usuarios_id_lider_de_creador '
        + 'from pedidos as p ' +
        'join usuarios as u on u.usuarios_id=p.usuarios_id_creador ' +
        'where u.usuarios_id_lider=?', [req.usuario.usuarios_id_lider]);
    let [pedidos] = response;
    console.log(`found ${pedidos.length} pedidos`)

    // filtrar pedidos de otros operarios o otros encargados 
    pedidos = pedidos.filter(async (pedido) => {
        const b = (await _verificarUsuarioRelacionadoCon(pedido, req))
        //console.log(`pedido ${JSON.stringify(pedido)}\n b ${b}`);
        return b
    });

    // Añadir stocks a cada pedido
    pedidos = await Promise.all(
        pedidos.map(async (pedido) => {
            pedido.stocks = await _readStocks(pedido.pedidos_id);
            return pedido;
        })
    )

    return pedidos;
}


const getById = async (pedidos_id, req) => {
    let [[pedido]] = await _getById(pedidos_id);
    if (!pedido) {
        throw new Error('Operación inválida: obtener un pedido con id no existente en la base de datos. ¿Está seguro que quiso pedir el pedido con id ' + pedidos_id + '?')
    }
    if ((await _verificarUsuarioRelacionadoCon(pedido, req))) {
        if (pedido) {
            pedido.stocks = await _readStocks(pedidos_id);
        }
        return pedido;
    } else {
        throw new Error('Operación inválida: ver un pedido al que no se está relacionado.' +
            `Para ver el pedido con id ${pedidos_id} debe ser Jefe de equipo, desarrollador de equipo o bien ser el creador, revisador o aprobador del pedido.`)
    }
}



const updateById = async (pedidos_id, datosQueActualizar, req) => {
    // Pedir pedido
    const [[pedido]] = await _getById(pedidos_id);

    if ((await _verificarUsuarioRelacionadoCon(pedido, req))) {

        // Verificar operaciones inválidas
        if ('pedidos_id' in datosQueActualizar) {
            throw new Error("Operación inválida. No se puede actualizar el id del pedido.")
        }

        Object.keys(pedido).forEach((k, i, arr) => {
            if (typeof pedido[k] == "object") {
                console.log(moment(pedido[k]).format('YYYY-MM-DD HH:mm:ss'));
            }

        });

        // Crear objeto pedido actualizado
        Object.keys(pedido).forEach((k) => {
            datosQueActualizar[k] ? pedido[k] = datosQueActualizar[k] : 1;
            // dar formato de MySQL a las fechas
            if (["fecha_salida", "fecha_llegada", "fecha_creacion"].includes(k)) {
                pedido[k] = moment(pedido[k]).format('YYYY-MM-DD HH:mm:ss');
            }
        });


        if ((await _verificarNormasDeNegocio(pedido))) {

            const extractValues = (r) => [
                "fecha_salida", "fecha_llegada",
                "estado_pedido", "medida", "fecha_creacion", "usuarios_id_creador", "usuarios_id_revisador",
                "almacenes_id_origen", "almacenes_id_destino", "camiones_id", "usuarios_id_aprobador", "pedidos_id"
            ].map(k => r[k]);

            const values = extractValues(pedido);

            if (datosQueActualizar.stocks) {
                //actualizar los stocks
                await db.query('DELETE FROM pedidos_have_stocks WHERE pedidos_id=?', [pedido.pedidos_id]);
                await _setStocks(pedidos_id, datosQueActualizar.stocks);
            }

            // Guardar en la base de datos cambiado
            return db.query(
                'UPDATE pedidos ' +
                'SET ' +
                'fecha_salida=?,' +
                'fecha_llegada=?,' +
                'estado_pedido=?,' +
                'medida=?,' +
                'fecha_creacion=?,' +
                'usuarios_id_creador=?,' +
                'usuarios_id_revisador=?,' +
                'almacenes_id_origen=?,' +
                'almacenes_id_destino=?,' +
                'camiones_id=?,' +
                'usuarios_id_aprobador=? ' +
                'WHERE pedidos_id = ? '
                ,
                values
            );
        } else {
            throw new Error('Operación inválida: verifica que pedido ' + JSON.stringify(pedido) + ' cumple con las siguientes condiciones.'
                + 'La fecha de creación debe ser anterior a la de salida y esta anterior a la de llegada. ' +
                'El revisador y aprobador deben pertencer al mismo equipo que el creador. ' +
                'El revisador debe ser encargado del almacen de origen y el aprobador ser encargado del almacen de destino.')
        }
    } else {
        throw new Error('Operación inválida: editar un pedido al que no se está relacionado.' +
            `Para editar el pedido con id ${pedidos_id} debe ser Jefe de equipo bien ser el creador, revisador o aprobador del pedido.`)

    }
};


const deleteById = async (pedidos_id, req) => {
    // Borrar un pedido
    // Evitar borrar pedidos predeterminados 1,2,3,4. 
    let [[pedido]] = await _getById(pedidos_id);

    if ((await _verificarUsuarioRelacionadoCon(pedido, req))) {
        
        await db.query('DELETE FROM pedidos_have_stocks WHERE pedidos_id=?', [pedidos_id]);
        return db.query('DELETE from pedidos where pedidos_id = ?', [pedidos_id]);
    } else {
        throw new Error('Operación inválida: borrar un pedido al que no se está relacionado.' +
            `Para borrar el pedido con id ${pedidos_id} debe ser Jefe de equipo.`)

    }
}



const _getById = async (pedidos_id) => {
    return await db.query('select * from pedidos where pedidos_id = ?', [pedidos_id]);

}

const _verificarNormasDeNegocio = async (pedido) => {
    let [creador] = await _getUsuarioById(pedido.usuarios_id_creador);
    let [revisador] = await _getUsuarioById(pedido.usuarios_id_revisador);
    let [aprobador] = await _getUsuarioById(pedido.usuarios_id_aprobador);
    let origen = await _getAlmacenById(pedido.almacenes_id_origen);
    let destino = await _getAlmacenById(pedido.almacenes_id_destino)
    let creacion = moment(pedido.fecha_creacion, "YYYY-MM-DD HH:mm:ss")
    let salida = moment(pedido.fecha_llegada, "YYYY-MM-DD HH:mm:ss")
    let llegada = moment(pedido.fecha_salida, "YYYY-MM-DD HH:mm:ss")

    console.log(`origen ${JSON.stringify(origen)}\ndestino${JSON.stringify(destino)}` )
       console.log(`creador ${creador} \n revisador ${JSON.stringify(revisador)}\n aprobador${JSON.stringify(aprobador)}\n`)
       console.log(`
       ((creador.usuarios_id_lider == revisador.usuarios_id_lider && aprobador.usuarios_id_lider == creador.usuarios_id_lider) \n 
       ${(creador.usuarios_id_lider == revisador.usuarios_id_lider && aprobador.usuarios_id_lider == creador.usuarios_id_lider)}&&
           (origen.usuarios_id_encargado == revisador.usuarios_id && destino.usuarios_id_encargado == aprobador.usuarios_id) &&
       ${(origen.usuarios_id_encargado == revisador.usuarios_id && destino.usuarios_id_encargado == aprobador.usuarios_id)}
           (moment.min(creacion, salida, llegada) == creacion && moment.min(salida, llegada) == salida)
          \n ${(moment.min(creacion, salida, llegada) == creacion && moment.min(salida, llegada) == salida)} )
           \n origen.usuarios_id_encargado == revisador.usuarios_id ${origen.usuarios_id_encargado == revisador.usuarios_id}\n
           destino.usuarios_id_encargado == aprobador.usuarios_id ${destino.usuarios_id_encargado == aprobador.usuarios_id}`)
        console.log(`creacion ${creacion}\n salida${salida}\n llegada ${llegada}`)
    return ((creador.usuarios_id_lider == revisador.usuarios_id_lider && aprobador.usuarios_id_lider == creador.usuarios_id_lider) &&
        (origen.usuarios_id_encargado == revisador.usuarios_id && destino.usuarios_id_encargado == aprobador.usuarios_id) &&
        (moment.min(creacion, salida, llegada) == creacion && moment.min(salida, llegada) == salida))

}

const _verificarUsuarioRelacionadoCon = async (pedido, req) => {
    const [creador] = await _getUsuarioById(pedido.usuarios_id_creador);

    return (req.usuario.roles_id == 4 && pedido.usuarios_id_creador == req.usuario.usuarios_id) ||
        ([1, 2].includes(req.usuario.roles_id) && creador.usuarios_id_lider == req.usuario.usuarios_id_lider) ||
        (req.usuario.roles_id == 3 && [pedido.usuarios_id_aprobador, pedido.usuarios_id_revisador].includes(req.usuario.usuarios_id))

}


const _setStocks = (pedidos_id, stocks) => {
    console.log(`_setStocks ${JSON.stringify(stocks)}`)

    stocks.forEach(async (stock) => {
        console.log(stock)
        await db.query('   INSERT INTO pedidos_have_stocks \
        (pedidos_id,stocks_id,unidades_utilizadas,posicion) VALUES (?,?,?,?)',
            [pedidos_id, stock.stocks_id, stock["unidades"], stock["posicion"]])
    });
}


const _readStocks = async (pedidos_id) => {
    let [stocks] = await db.query('select * from pedidos_have_stocks where pedidos_id = ?', [pedidos_id]);
    let result = []
    // console.log(stocks)
    if (stocks) {
        stocks.forEach((stock) => {
            // console.log(stock)
            result.push({ "unidades_utilizadas": stock.unidades_utilizadas, "posicion": stock.posicion, "stocks_id": stock.stocks_id })
        });
    }
    //console.log(result)
    return result
}


module.exports = {
    create, getAll, getById, updateById, deleteById, _getById
}