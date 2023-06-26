
const moment = require("moment")
const { _getById: _getUsuarioById } = require('./usuarios.model')
const { _getById: _getAlmacenById } = require('./almacenes.model')
const { _getById: _getStockById, _getStockByAlmacenMaterial ,} = require('./stocks.model');
const e = require("express");

const create = async (pedido, req) => {
    // Crear un nuevo pedido
    console.debug(`crear pedido ${JSON.stringify(pedido)}`);

    if (!((await _verificarNormasDeNegocio(pedido)) && (await _verificarUsuarioRelacionadoCon(pedido, req)))) {
        throw new Error('Operación inválida: verifica que pedido ' + JSON.stringify(pedido) + ' cumple con las siguientes condiciones.'
            + 'La fecha de creación debe ser anterior a la de salida y esta anterior a la de llegada. ' +
            'El revisador y aprobador deben pertencer al mismo equipo que el creador. ' +
            'El revisador debe ser encargado del almacen de origen y el aprobador ser encargado del almacen de destino.')
    }

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

    // Siempre se crea en estado_pedido En revisión.
    estado_pedido = "En revisión";
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

    //Añadir pedido
    let response = await db.query('INSERT INTO pedidos (fecha_salida,fecha_llegada, ' +
        ' estado_pedido,medida,fecha_creacion,usuarios_id_creador,usuarios_id_revisador, ' +
        ' almacenes_id_origen,almacenes_id_destino,camiones_id,usuarios_id_aprobador) ' +
        ' VALUES ' +
        ' (?,?,?,?,?,?,?,?,?,?,?)',
        values
    );

    // Añadir los registros de la tabla pedidos_have_stocks
    if ("insertId" in response[0]) {
        _setStocks(response[0].insertId, stocks)
    }

    return response


};



const getAll = async (req) => {
    let response = await db.query(' select p.*, u.usuarios_id_lider as usuarios_id_lider_de_creador '
        + 'from pedidos as p ' +
        'join usuarios as u on u.usuarios_id=p.usuarios_id_creador ' +
        'where u.usuarios_id_lider=?', [req.usuario.usuarios_id_lider]);

    let [pedidos] = response;
    console.debug(`found ${pedidos.length} pedidos`)


    // filtrar pedidos de otros operarios o otros encargados 
    filtro = await Promise.all(pedidos.map(async (pedido) => {
        const b = (await _verificarUsuarioRelacionadoCon(pedido, req))
        //console.debug(`pedido ${JSON.stringify(pedido)}\n b ${b}`);
        return b
    }));
    pedidos = pedidos.filter((_, i) => filtro[i]);
    console.debug(`found ${pedidos.length} pedidos after filtering`)


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

        // transformar fechas
        Object.keys(pedido).forEach((k, i, arr) => {
            if (typeof pedido[k] == "object") {
                pedido[k] = moment(pedido[k]).format('YYYY-MM-DD HH:mm:ss');
            }

        });

        // Verificar flujo de negocio
        if (pedido.estado_pedido == 'En revisión' && datosQueActualizar.estado_pedido && datosQueActualizar.estado_pedido != pedido.estado_pedido &&
            ((datosQueActualizar.estado_pedido != 'En preparación' && datosQueActualizar.estado_pedido != 'Cancelado') || req.usuario.usuarios_id != pedido.usuarios_id_revisador)) {

            throw new Error(String.raw`No se pudo actualizar el estado de 'En revisión' a '${datosQueActualizar.estado_pedido}'. A lo mejor no eres el encargado del almacen de origen.`)

        } else if (pedido.estado_pedido == 'En preparación' && datosQueActualizar.estado_pedido && datosQueActualizar.estado_pedido != pedido.estado_pedido &&
            (datosQueActualizar.estado_pedido != 'En tránsito' || req.usuario.usuarios_id != pedido.usuarios_id_creador)) {

            throw new Error(String.raw`No se pudo actualizar el estado de 'En preparación' a '${datosQueActualizar.estado_pedido}'. A lo mejor no eres el operario del pedido.`)

        } else if (pedido.estado_pedido == 'En tránsito' && datosQueActualizar.estado_pedido && datosQueActualizar.estado_pedido != pedido.estado_pedido &&
            (datosQueActualizar.estado_pedido != 'Entregado' || req.usuario.usuarios_id != pedido.usuarios_id_creador)) {

            throw new Error(String.raw`No se pudo actualizar el estado de 'En tránsito' a '${datosQueActualizar.estado_pedido}'. A lo mejor no eres el operario del pedido.`)

        } else if (pedido.estado_pedido == 'Entregado' && datosQueActualizar.estado_pedido && datosQueActualizar.estado_pedido != pedido.estado_pedido &&
            ((datosQueActualizar.estado_pedido != 'Aprobado' && datosQueActualizar.estado_pedido != 'Rechazado') || req.usuario.usuarios_id != pedido.usuarios_id_aprobador)) {

            throw new Error(String.raw`No se pudo actualizar el estado de 'Entregado' a '${datosQueActualizar.estado_pedido}'. A lo mejor no eres el encargado del almacen de destino.`)

        } else if (['Aprobado', 'Rechazado', 'Cancelado'].includes(pedido.estado) && datosQueActualizar.estado_pedido && datosQueActualizar.estado_pedido != pedido.estado_pedido &&
            ((datosQueActualizar.estado_pedido != 'Aprobado' && datosQueActualizar.estado_pedido != 'Rechazado') || req.usuario.usuarios_id != pedido.usuarios_id_aprobador)) {

            throw new Error(String.raw`No se puede actualizar el estado de un pedido después de haber sido Aprobado, Rechazado o Cancelado.`)

        } else if (pedido.estado_pedido == 'Entregado' && datosQueActualizar.estado_pedido && datosQueActualizar.estado_pedido != pedido.estado_pedido &&
            (datosQueActualizar.estado_pedido == 'Aprobado' || req.usuario.usuarios_id != pedido.usuarios_id_aprobador)) {
            
            console.log(`Reached updateById`)
            // sumar en almacen destino los stocks
            let previousStocks = await _readStocks(pedidos_id);
            console.log(`_readStocks = ${JSON.stringify(previousStocks)}`)
            if (previousStocks) {

                await Promise.all(previousStocks.map(async (s) => {
                    
                    const [stockDestinacion] = await _getStockByAlmacenMaterial(pedido.almacenes_id_destino, s.materiales_id);
                    console.log(`stockDestinacion ${JSON.stringify(stockDestinacion)}`);
                    let unidades =0; 
                    if (stockDestinacion) {
                        unidades += stockDestinacion.unidades
                        await db.query('update stocks set unidades=? where almacenes_id=? and materiales_id= ?', [unidades + s.unidades_utilizadas, pedido.almacenes_id_destino, s.materiales_id]);
                    } else {
                        let [[posicion]] = await db.query('select max(posicion)+1 from stocks where almacenes_id=?', [ pedido.almacenes_id_destino])
                        posicion=posicion["max(posicion)+1"]
                        console.log(`posicion es ${JSON.stringify(posicion)}`);

                        const values=[pedido.almacenes_id_destino, s.materiales_id, s.unidades_utilizadas, posicion]
                      
                        await db.query('insert into stocks (almacenes_id, materiales_id,unidades,posicion) values (?,?,?,?) ',values)

                    }

                    
                }));
            }

        } else if (pedido.estado_pedido == 'Entregado' && datosQueActualizar.estado_pedido && datosQueActualizar.estado_pedido != pedido.estado_pedido &&
            (datosQueActualizar.estado_pedido == 'Rechazado' || req.usuario.usuarios_id != pedido.usuarios_id_aprobador)) {
            // sumar en almacen de origen los stocks 
            let previousStocks = await _readStocks(pedidos_id);
            if (previousStocks) {
                await Promise.all(previousStocks.map(async (s) => {
                    const [{ unidades }] = await _getStockById(s.stocks_id);
                    await db.query('update stocks set unidades=? where stocks_id=? ', [unidades + s.unidades_utilizadas, s.stocks_id]);
                }));
            }

        } else if (pedido.estado_pedido != "En revisión") {
            ["fecha_salida", "fecha_llegada",
                "medida", "fecha_creacion", "usuarios_id_creador", "usuarios_id_revisador",
                "almacenes_id_origen", "almacenes_id_destino", "camiones_id", "usuarios_id_aprobador"].forEach(k => { delete datosQueActualizar[k] })
        }




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


    if (!(await _verificarUsuarioRelacionadoCon(pedido, req))) {
        throw new Error('Operación inválida: borrar un pedido al que no se está relacionado.' +
            `Para borrar el pedido con id ${pedidos_id} debe ser Jefe de equipo.`)
    } else if (!["En revisión", "Aprobado", "Cancelado", "Rechazado"].includes(pedido.estado_pedido)) {
        throw new Error(String.raw`No se puede borrar un pedido que no esté en estado 'En revisión', 'Aprobado', 'Cancelado' o 'Rechazado'.`)
    }

    await db.query('DELETE FROM pedidos_have_stocks WHERE pedidos_id=?', [pedidos_id]);
    return db.query('DELETE from pedidos where pedidos_id = ?', [pedidos_id]);

}



const _getById = async (pedidos_id) => {
    const pedido = await db.query('select * from pedidos where pedidos_id = ?', [pedidos_id]);
    if (!pedido) {
        throw new Error('Operación inválida: obtener un pedido con id no existente en la base de datos. ¿Está seguro que quiso pedir el pedido con id ' + pedidos_id + '?')
    }
    return pedido;
}


const _verificarNormasDeNegocio = async (pedido) => {
    let [creador] = await _getUsuarioById(pedido.usuarios_id_creador);
    let [revisador] = await _getUsuarioById(pedido.usuarios_id_revisador);
    let [aprobador] = await _getUsuarioById(pedido.usuarios_id_aprobador);
    let origen = await _getAlmacenById(pedido.almacenes_id_origen);
    let destino = await _getAlmacenById(pedido.almacenes_id_destino)
    let creacion = moment(pedido.fecha_creacion, "YYYY-MM-DD HH:mm:ss")
    let salida = moment(pedido.fecha_salida, "YYYY-MM-DD HH:mm:ss")
    let llegada = moment(pedido.fecha_llegada, "YYYY-MM-DD HH:mm:ss")

    console.debug(`origen ${JSON.stringify(origen)}\ndestino${JSON.stringify(destino)}`)
    console.debug(`creador ${creador} \n revisador ${JSON.stringify(revisador)}\n aprobador${JSON.stringify(aprobador)}\n`)
    console.debug(`
        ((creador.usuarios_id_lider == revisador.usuarios_id_lider && aprobador.usuarios_id_lider == creador.usuarios_id_lider) \n 
        ${(creador.usuarios_id_lider == revisador.usuarios_id_lider && aprobador.usuarios_id_lider == creador.usuarios_id_lider)}&&
            (origen.usuarios_id_encargado == revisador.usuarios_id && destino.usuarios_id_encargado == aprobador.usuarios_id) &&
        ${(origen.usuarios_id_encargado == revisador.usuarios_id && destino.usuarios_id_encargado == aprobador.usuarios_id)}
            (moment.min(creacion, salida, llegada) == creacion && moment.min(salida, llegada) == salida)
           \n ${(moment.min(creacion, salida, llegada) == creacion && moment.min(salida, llegada) == salida)} )
            \n origen.usuarios_id_encargado == revisador.usuarios_id ${origen.usuarios_id_encargado == revisador.usuarios_id}\n
            destino.usuarios_id_encargado == aprobador.usuarios_id ${destino.usuarios_id_encargado == aprobador.usuarios_id}`)
    console.debug(`creacion ${creacion}\n salida${salida}\n llegada ${llegada}`)
    return ((creador.usuarios_id_lider == revisador.usuarios_id_lider && aprobador.usuarios_id_lider == creador.usuarios_id_lider) &&
        (origen.usuarios_id_encargado == revisador.usuarios_id && destino.usuarios_id_encargado == aprobador.usuarios_id) &&
        (moment.min(creacion, salida, llegada) == creacion && moment.min(salida, llegada) == salida))

}

const _verificarUsuarioRelacionadoCon = async (pedido, req) => {
    const [creador] = await _getUsuarioById(pedido.usuarios_id_creador);

    let relacionado = ((req.usuario.roles_id == 4 && pedido.usuarios_id_creador == req.usuario.usuarios_id) ||
        ([1, 2].includes(req.usuario.roles_id) && creador.usuarios_id_lider == req.usuario.usuarios_id_lider) ||
        //(req.usuario.roles_id == 3 && [pedido.usuarios_id_aprobador, pedido.usuarios_id_revisador].includes(req.usuario.usuarios_id))
        ( [pedido.usuarios_id_aprobador, pedido.usuarios_id_revisador].includes(req.usuario.usuarios_id)))
    console.log(`pedido es ${JSON.stringify(pedido)}\n req.usuario es ${JSON.stringify(req.usuario.usuarios_id)}\n relacionado es ${relacionado}`)
    return relacionado
}


const _setStocks = async (pedidos_id, stocks) => {
    //console.debug(`_setStocks ${JSON.stringify(stocks)}`)

    // Pedir pedidos anteriores
    let previousStocks = await _readStocks(pedidos_id);
    //console.debug('previousStocks' + previousStocks)
    if (previousStocks) {
        // Restaurar los stocks al almacen y borrar los antiguos pedidos_have_stocks  
        await Promise.all(previousStocks.map(async (phs) => {
            const [{ unidades }] = await _getStockById(phs.stocks_id);

            await db.query('update stocks set unidades=? where stocks_id=? ', [unidades + phs.unidades_utilizadas, phs.stocks_id]);
            await db.query('delete from pedidos_have_stocks where stocks_id = ? and pedidos_id=?', [phs.stocks_id, pedidos_id])
        }));
    }
    // Restar del almacen los nuevos stocks y añadir los pedidos_have_stocks
    stocks.forEach(async (s) => {
        try {
            console.log(`s ${JSON.stringify(s)}`)
            const [{ unidades }] = await _getStockById(s.stocks_id);
            console.log(`s ${JSON.stringify(unidades)}`)
            /*  console.debug(`unidades${unidades}, s ${JSON.stringify(s)}`);      
             console.debug(`unidades is ${unidades} s.unidades is ${s.unidades} and unidades - s.unidades is ${unidades - s.unidades}`)
             */
            await db.query('update stocks set unidades = ? where stocks_id = ? ', [unidades - s.unidades, s.stocks_id])
            await db.query('INSERT INTO pedidos_have_stocks ' +
                '(pedidos_id,stocks_id,unidades_utilizadas,posicion) VALUES (?,?,?,?)',
                [pedidos_id, s.stocks_id, s["unidades"], s["posicion"]]);
        } catch (e) {
            console.error(`No he podido actualizar las unidades del stock ${s}. El error ha sido \n${e}`);
        }
    });
}


const _readStocks = async (pedidos_id) => {
    let [stocks] = await db.query('select phs.unidades_utilizadas, phs.posicion, phs.stocks_id, s.materiales_id from pedidos_have_stocks as phs join stocks as s on s.stocks_id=phs.stocks_id where pedidos_id = ?', [pedidos_id]);
    let result = []
    // console.debug(stocks)
    if (stocks) {
        stocks.forEach((stock) => {
            // console.debug(stock)
            result.push({ "unidades_utilizadas": stock.unidades_utilizadas, "posicion": stock.posicion, "stocks_id": stock.stocks_id, "materiales_id":stock.materiales_id })
        });
    }
    // console.debug(`result is ${result}`)
    return result
}


module.exports = {
    create, getAll, getById, updateById, deleteById, _getById
}