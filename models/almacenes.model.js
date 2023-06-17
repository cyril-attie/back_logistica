
const { create: createStock } = require("./stocks.model");




const createPoints = (a) => {

    if ("coordenadas" in a) {
        a["coordenadax"] = a["coordenadas"]["x"]
        a["coordenaday"] = a["coordenadas"]["y"]
    };
    return a;
}
const create = async (almacen) => {
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
        _setStocks(almacen_id, stocks)
    }
    return response
};



const _setStocks = (almacenes_id, stocks) => {
    console.log(`_setStocks ${JSON.stringify(stocks)}\n\n almacenes_id ${almacenes_id} `)
    stocks.forEach(async (stock) => {
        let stock2create = {
            unidades: stock["unidades"],
            materiales_id:stock["materiales_id"],
            "almacenes_id": almacenes_id,
            posicion: stock["posicion"]
        };
        await createStock(stock2create);
    })
}

const _readStocks = async (almacenes_id) => {
    console.log(`almacenes_id ${almacenes_id}`);
    let [stocks] = await db.query('select * from stocks where almacenes_id = ?', [almacenes_id]);
    let result = []
   console.log(stocks);
    if (stocks) {
        stocks.forEach((stock) => {
            result.push({"material_id": stock.materiales_id, "unidades":stock.unidades , "posicion": stock.posicion});
        });
    }
    console.log(result);
    return result
}

const getAll = async () => {
    let [response] = await db.query('   SELECT *\
                        FROM almacenes as a'
    );
    let almacenes =  await Promise.all(
        response.map(async (almacen) => {
            almacen.stocks = await _readStocks(almacen.almacenes_id);
            return almacen;
        })
      )
      console.log(almacenes);
     return almacenes;
}


const getById = async (almacenes_id) => {
    let response = await db.query('select * from almacenes where almacenes_id = ?', [almacenes_id])
    let [[almacen]]= response;
    if (almacen) {
        almacen.stocks = await _readStocks(almacenes_id);
    }
    console.log(`almacen ${JSON.stringify(almacen)}\n`)
    return response;
}


const _getById = async (almacenes_id) => {
    let [[response]] = await db.query('select * from almacenes where almacenes_id = ?', [almacenes_id])
    return response;
}

const updateById = async (almacenes_id, datosQueActualizar) => {
    // Verificar operaciones inválidas
    if ('almacenes_id' in datosQueActualizar) {
        throw new Error("Operación inválida. No se puede actualizar el id del almacén.")
    }

    // Pedir almacene
    const [[almacene]] = await getById(almacenes_id);

    // Actualizar almacene
    Object.keys(almacene).forEach((k) => {
        datosQueActualizar[k] ? almacene[k] = datosQueActualizar[k] : 1;
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

    let values = extractValues(createPoints(almacene));
    console.log(values);

     //actualizar los stocks
     db.query('DELETE FROM stocks WHERE almacenes_id=?',[almacenes_id]);
     _setStocks(almacenes_id, datosQueActualizar.stocks);

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


const deleteById = async (almacenes_id) => {
    // Borrar un almacen
    db.query('DELETE FROM stocks WHERE almacenes_id=?',[almacenes_id]); 
    return db.query('DELETE from almacenes where almacenes_id = ?', [almacenes_id]);
}


module.exports = {
    create, getAll, getById, _getById, updateById, deleteById
}