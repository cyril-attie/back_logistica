

const createPoints = (a) => {

    if ("coordenadas" in a) {
        a["coordenadax"] = a["coordenadas"]["x"]
        a["coordenaday"] = a["coordenadas"]["y"]
    };
    return a;
}
const create = (almacen) => {
    let { nombre_almacen
        , calle
        , codigo_postal
        , localidad
        , pais
        , coordenadax
        ,coordenaday
        , capacidad_almacen
        , usuarios_id_encargado
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

    return db.query('   INSERT INTO almacenes ( nombre_almacen , calle ,\
        codigo_postal ,localidad,pais,coordenadas, capacidad_almacen , usuarios_id_encargado  ) \
        VALUES \
        (?, ?, ?, ?, ?, POINT(?,?), ?, ?)',
        values
    );
};


const getAll = () => {
    return db.query('   SELECT *\
                        FROM almacenes as a'
    );
}


const getById = (almacenes_id) => {
    console.log(almacenes_id)
    return db.query('select * from almacenes where almacenes_id = ?', [almacenes_id])
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
    console.log(almacene);
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

    const [[almacene]] = await getById(almacenes_id);

    return db.query('DELETE from almacenes where almacenes_id = ?', [almacenes_id]);
}


module.exports = {
    create, getAll, getById, updateById, deleteById
}