
const { getAll: getallStocks, updateById: updateStockById, create: createStock, encargado_o_jefe } = require("./stocks.model");
const { _getById: _getUsuarioById } = require('./usuarios.model')

const create = async (almacen, req) => {

    const [encargadoDeAlmacen] = await _getUsuarioById(almacen.usuarios_id_encargado);

    //Verificaciones de peticiones inválidas: crear un almacen con encargado liderado por otro jefe de equipo. 
    if (req.usuario.usuarios_id != encargadoDeAlmacen.usuarios_id_lider) {
        throw new Error('Operación inválida: crear un almacen con un encargado que no está en tu equipo. ' +
            `${encargadoDeAlmacen.email} está en otro equipo. ` +
            'Habla con el jefe de ese equipo para que reasigne el usuario o cree el almacen en el otro equipo.');
    }

    let { nombre_almacen
        , calle
        , codigo_postal
        , localidad
        , pais
        , coordenadax
        , coordenaday
        , capacidad_almacen
        , usuarios_id_encargado
        , stocks
    } = createPoints(almacen);

    let values = [nombre_almacen
        , calle
        , codigo_postal
        , localidad
        , pais
        , coordenadax
        , coordenaday
        , capacidad_almacen
        , usuarios_id_encargado
    ];

    let response = await db.query('   INSERT INTO almacenes ( nombre_almacen , calle ,\
        codigo_postal ,localidad,pais,coordenadas, capacidad_almacen , usuarios_id_encargado  ) \
        VALUES \
        (?, ?, ?, ?, ?, POINT(?,?), ?, ?)',
        values
    );

    if ("insertId" in response[0]) {
        let almacen_id = response[0].insertId;
        _setStocks(almacen_id, stocks, req);
    }
    return response
};

const _getByEncargado = async (encargadoId) => {
    return await db.query('select a.*,u.email as email_encargado, u.usuarios_id_lider lider_equipo ' +
        'from almacenes as a join usuarios as u on u.usuarios_id=a.usuarios_id_encargado ' +
        'where a.usuarios_id_encargado=? ', [encargadoId]);
}


const getAll = async (req) => {
    // Pedir todos los almacenes del equipo, salvo si es un encargado,entonces pedir solo su almacén. 
    let { query, values } = _getQueryAndValues(req);

    [response] = await db.query(query, values);

    // Añadir los stocks de almacenes
    let almacenes = await Promise.all(
        response.map(async (almacen) => {
            almacen.stocks = await _readStocks(almacen.almacenes_id, req);
            return almacen;
        })
    )
    // console.debug(almacenes);
    return almacenes;
}


const getById = async (almacenes_id, req) => {
    // Pedir almacen del equipo. 
    let { query, values } = _getQueryAndValues(req);
    query += ' and almacenes_id = ? ';
    values.push(almacenes_id);

    let [[almacen]] = await db.query(query, values);

    if (almacen) {
        almacen.stocks = await _readStocks(almacenes_id, req);
    }
    // console.debug(`almacen ${JSON.stringify(almacen)}\n`)
    return almacen;
}

const updateById = async (almacenes_id, datosQueActualizar, req) => {
    //pedir datos
    const almacen = await _getById(almacenes_id);
    if (!almacen) { throw new Error('Operación inválida: editar un almacen que no existe.') }
    const [encargadoDeAlmacen] = await _getUsuarioById(almacen.usuarios_id_encargado);

    console.debug(`almacen ${JSON.stringify(almacen)}\n encargadoAlmacen ${encargadoDeAlmacen}`)


    // Verificar operaciones inválidas
    if ('almacenes_id' in datosQueActualizar) {
        throw new Error("Operación inválida. No se puede actualizar el id del almacén.")
    } else if (req.usuario.usuarios_id_lider != encargadoDeAlmacen.usuarios_id_lider) {
        throw new Error('Operación inválida: editar un almacen con un encargado que no está en tu equipo. ' +
            `${encargadoDeAlmacen.email} está en otro equipo. ` +
            'Habla con el jefe de ese equipo para que reasigne el usuario o edite el almacen desde el otro equipo.');
    }

    // Actualizar almacene
    Object.keys(almacen).forEach((k) => {
        datosQueActualizar[k] ? almacen[k] = datosQueActualizar[k] : 1;
    });

    const extractValues = (a) => [
        "nombre_almacen"
        , "calle"
        , "codigo_postal"
        , "localidad"
        , "pais"
        , "coordenadax", "coordenaday"
        , "capacidad_almacen"
        , "usuarios_id_encargado", "almacenes_id"].map(k => a[k]);

    let values = extractValues(createPoints(almacen));
    console.debug(values);

    //actualizar los stocks
    if (datosQueActualizar.stocks) {
        _setStocks(almacenes_id, datosQueActualizar.stocks, req);
    }

    // Guardar en la base de datos cambiado
    return db.query(
        'UPDATE almacenes \
                        SET\
                        nombre_almacen =?   \
                        ,calle          =?   \
                        ,codigo_postal  =?   \
                        ,localidad      =?   \
                        ,pais           =?   \
                        ,coordenadas    =POINT(?,?)   \
                        ,capacidad_almacen      =?    \
                        ,usuarios_id_encargado  =?    \
                        WHERE almacenes_id = ? '
        ,
        values
    );
};


const deleteById = async (almacenes_id, req) => {
    // Para borrar un almacen. 
    // Verificar operación es válida 
    const almacen = await _getById(almacenes_id);
    if (!almacen) { throw new Error('Operación inválida: editar un almacen que no existe.') }

    if (!encargado_o_jefe(almacenes_id, req)) {
        throw new Error("Operación inválida: borrar un almacen de otro equipo o encargado de almacen. No eres encargado o jefe de encargado de este almacen.")
    }

    // POR HACER: ¿QUé pasa si el almacen tiene pedidos?

    // Borrar un almacen
    await db.query(' DELETE from stocks where almacenes_id = ?', [almacenes_id]);
    return db.query('DELETE from almacenes where almacenes_id = ?', [almacenes_id]);
}


// ========= helpers==========


const _getById = async (almacenes_id) => {
    let [[response]] = await db.query('select * from almacenes where almacenes_id = ?', [almacenes_id])
    return response;
}

const _setStocks = async (almacenes_id, stocks, req) => {
    let existingStocks = await _readStocks(almacenes_id, req);

    // returns the stocks_id if already Exists
    const stocks_id_ifAlreadyExists = (s) => {
        return existingStocks.find(s2 => (s.materiales_id == s2.materiales_id))
    }

    existingStocks.forEach(async (s) => {
        await updateStockById(s.stocks_id, { unidades: 0, posicion: 0 }, req)
    })
    console.debug(JSON.stringify(existingStocks))
    console.debug(`_setStocks ${JSON.stringify(stocks)}\n\n almacenes_id ${almacenes_id} `)
    stocks.forEach(async (stock) => {
        console.debug(`stocks_id_ifAlreadyExists(stock) ${JSON.stringify(stocks_id_ifAlreadyExists(stock))}\n
    STOCK ${JSON.stringify(stock)}`)
        if (stocks_id_ifAlreadyExists(stock)) {
            await updateStockById(stocks_id_ifAlreadyExists(stock).stocks_id, { unidades: stock.unidades, posicion: stock.posicion }, req)
        } else {
            let stock2create = {
                unidades: stock["unidades"],
                materiales_id: stock["materiales_id"],
                "almacenes_id": almacenes_id,
                posicion: stock["posicion"]
            };
            await createStock(stock2create, req);
        }
    })
}

const _readStocks = async (almacenes_id, req) => {
    let [stocks] = await getallStocks(req);
    stocks = stocks.filter((stock) => (stock.almacenes_id == almacenes_id && stock.unidades!=0))
    
    stocks.sort((a,b)=>(a.posicion-b.poscion))
    //stocks=stocks.map(extractTheEssential)
    //console.debug(`stocks ${JSON.stringify(stocks)}`);
    return stocks
}

const createPoints = (a) => {

    if ("coordenadas" in a) {
        a["coordenadax"] = a["coordenadas"]["x"]
        a["coordenaday"] = a["coordenadas"]["y"]
    };
    return a;
}

const _getQueryAndValues = (req) => {
    let encargadoId;
    if (req.usuario.roles_id == 3) {
        encargadoId = req.usuario.usuarios_id;
    }
    let query =
        'select a.*,u.email as email_encargado, u.usuarios_id_lider lider_equipo ' +
        'from almacenes as a join usuarios as u on u.usuarios_id=a.usuarios_id_encargado where u.usuarios_id_lider=? ' +
        (encargadoId ? 'and a.usuarios_id_encargado=?' : '');

    let values = [4, 1].includes(req.usuario.roles_id) ? [req.usuario.usuarios_id_lider] : [req.usuario.usuarios_id];

    encargadoId ? values.push(encargadoId) : 1;
    //console.debug(`query ${query}\n values ${values}`);
    return { query, values }
}


//===========EXPORTS=========
module.exports = {
    create, getAll, getById, _getById, updateById, deleteById
}
